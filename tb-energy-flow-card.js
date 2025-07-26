class EnergyFlowCard extends HTMLElement {
  connectedCallback() {
    const c = this._config;
    this.lineWidth = c.line_width || 3;
    this.lineColor = c.line_color || 'gray';
    this.highlightColor = c.highlight_color || 'orange';
    this.glowSize = c.glow_size || 8;
    this.invertGrid = c.invert_grid === true;
    this.invertBattery = c.invert_battery === true;

    this.labelYOffsetTop = c.label_y_offset_top || -30;
    this.valueYOffsetTop = c.value_y_offset_top || -10;
    this.labelYOffsetBottom = c.label_y_offset_bottom || 22;
    this.valueYOffsetBottom = c.value_y_offset_bottom || 40;

    this.imageYOffsetTop = c.image_y_offset_top || -6;
    this.imageYOffsetBottom = c.image_y_offset_bottom || -40;
    this.imageSizeTop = c.image_size_top || 48;
    this.imageSizeBottom = c.image_size_bottom || 48;

    this.inverterImageWidth = c.inverter_image_width || 60;
    this.inverterImageHeight = c.inverter_image_height || 60;

    this.fontSizeLabel = c.font_size_label || 12;
    this.fontSizeValue = c.font_size_value || 12;
    this.fontWeightValue = c.font_weight_value || 'bold';

    this.decimalPrecision = c.decimal_precision !== false;

    this.highlightLength = c.highlight_length || 50;
    this.animationDurationConfig = c.animation_duration || '3s';

    const showMicro = c.show_micro !== false;
    this.showSolar2 = c.show_solar2 === true;

    const temps = c.temp || {};
    const tempPos = c.temp_position || {};
    const tempFont = c.temp_font || {};

    // Define offsets for label and value of temperature
    const tempLabelYOffset = tempFont.label_y_offset || -10;
    const tempValueYOffset = tempFont.value_y_offset || 10;

    const drawTemp = (key) => {
      if (!temps[key]) return '';
      const pos = tempPos[key] || { x: 0, y: 0 };
      const prefix = key.toUpperCase() + '';
      const labelFontSize = tempFont.label_size || 14;
      const valueFontSize = tempFont.size || 16;

      return `
        <g id="temp-${key}" transform="translate(${pos.x},${pos.y})">
          <text text-anchor="middle" y="${tempLabelYOffset}" font-size="${labelFontSize}px" font-weight="${tempFont.weight || 'normal'}" fill="var(--primary-text-color)">${prefix}</text>
          <text id="val-temp-${key}" text-anchor="middle" y="${tempValueYOffset}" font-size="${valueFontSize}px" font-weight="${tempFont.weight || 'normal'}" fill="var(--primary-text-color)">0°C</text>
        </g>`;
    };

    this.innerHTML = `
      <style>
        :host {
          display: block;
          background-color: var(--card-background-color, white);
          border-radius: var(--ha-card-border-radius, 12px);
          padding: 16px;
        }
        .value {
          font-weight: ${this.fontWeightValue};
          fill: var(--primary-text-color, #333);
          font-size: ${this.fontSizeValue}px;
          text-anchor: middle;
        }
        .label {
          font-size: ${this.fontSizeLabel}px;
          fill: var(--primary-text-color, #333);
          text-anchor: middle;
        }
        .path-line {
          stroke: ${this.lineColor};
          stroke-width: ${this.lineWidth};
          fill: none;
          stroke-linecap: round;
        }
        .highlight {
          stroke: ${this.highlightColor};
          stroke-width: ${this.lineWidth};
          fill: none;
          stroke-linecap: round;
          stroke-dasharray: ${this.highlightLength} 570;
          stroke-dashoffset: 600;
          animation: dashmove var(--duration, 3s) linear infinite;
          filter: drop-shadow(0 0 ${this.glowSize}px ${this.highlightColor});
        }
        .highlight-reverse {
          animation-direction: reverse;
        }
        @keyframes dashmove {
          0% { stroke-dashoffset: 600; }
          100% { stroke-dashoffset: 0; }
        }
      </style>
      <svg viewBox="0 0 600 600" width="100%" height="100%">
        <defs>
          <path id="solar" d="M 80,100 L 80,230 A 20,20 0 0,0 100,250 L 300,250 L 300,300"/>
          <path id="grid" d="M 520,100 L 520,230 A 20,20 0 0,1 500,250 L 300,250 L 300,300"/>
          <path id="battery" d="M 80,500 L 80,370 A 20,20 0 0,1 100,350 L 300,350 L 300,300"/>
          <path id="load" d="M 520,500 L 520,370 A 20,20 0 0,0 500,350 L 300,350 L 300,300"/>
          ${this.showSolar2 ? `<path id="solar2" d="M 300,100 L 300,300"/>` : ''} 
          ${showMicro ? `<path id="micro" d="M 300,500 L 300,300"/>` : ''}
        </defs>
        <use href="#solar" class="path-line"/>
        <use href="#grid" class="path-line"/>
        <use href="#battery" class="path-line"/>
        <use href="#load" class="path-line"/>
        ${this.showSolar2 ? `<use href="#solar2" class="path-line"/>` : ''} 
        ${showMicro ? `<use href="#micro" class="path-line"/>` : ''}

        <use id="anim-solar" href="#solar" class="highlight"/>
        <use id="anim-grid" href="#grid" class="highlight"/>
        <use id="anim-battery" href="#battery" class="highlight"/>
        <use id="anim-load" href="#load" class="highlight"/>
        ${this.showSolar2 ? `<use id="anim-solar2" href="#solar2" class="highlight"/>` : ''} 
        ${showMicro ? `<use id="anim-micro" href="#micro" class="highlight"/>` : ''}

        ${this._node(80, 100, 'solar', c.name_solar || 'Quang điện', c.image_solar, 'top')}
        ${this._node(520, 100, 'grid', c.name_grid || 'Lưới EVN', c.image_grid, 'top')}
        ${this._node(80, 500, 'battery', c.name_battery || 'Pin', c.image_battery, 'bottom')}
        ${this._node(520, 500, 'load', c.name_load || 'Tải', c.image_load, 'bottom')}
        ${this.showSolar2 ? this._node(300, 100, 'solar2', c.name_solar2 || 'Solar 2', c.image_solar2, 'top') : ''}
        ${showMicro ? this._node(300, 500, 'micro', c.name_micro || 'MicroInverter', c.image_micro, 'bottom') : ''}

        ${c.inverter_image ? `<image href="${c.inverter_image}" x="${300 - this.inverterImageWidth/2}" y="${300 - this.inverterImageHeight/2}" width="${this.inverterImageWidth}" height="${this.inverterImageHeight}"/>` : ''}

        ${c.grid_status ? `
        <g id="grid-status-icon" transform="translate(${c.grid_status_x || 410},${c.grid_status_y || 200})">
          <circle r="10" fill="gray"/>
          <text id="grid-status-symbol" text-anchor="middle" y="5" font-size="14px" font-weight="bold" fill="white">?</text>
        </g>` : ''}

        ${drawTemp('ac')}
        ${drawTemp('dc')}
      </svg>
    `;
  }

  set hass(hass) {
    this._hass = hass;
    const c = this._config;
    const showMicro = c.show_micro !== false;

    const getVal = (id) => {
      const s = hass.states[id];
      return s ? parseFloat(s.state) : 0;
    };

    const getUnit = (id) => {
      const s = hass.states[id];
      return s?.attributes?.unit_of_measurement || '';
    };

    const v = {
      solar: getVal(c.solar),
      grid: getVal(c.grid),
      battery: getVal(c.battery),
      micro: showMicro ? getVal(c.entity_micro) : 0,
      solar2: this.showSolar2 ? getVal(c.solar2) : 0,
      load: getVal(c.load),
      soc: getVal(c.soc), // Lấy giá trị SOC từ cấu hình
    };

    const u = {
      solar: getUnit(c.solar),
      grid: getUnit(c.grid),
      battery: getUnit(c.battery),
      micro: showMicro ? getUnit(c.entity_micro) : '',
      solar2: this.showSolar2 ? getUnit(c.solar2) : '',
      load: getUnit(c.load),
      soc: getUnit(c.soc), // Lấy đơn vị cho SOC (nếu có, thường là %)
    };

    const getSpeed = (val) => {
      if (this.animationDurationConfig !== 'auto') return this.animationDurationConfig;
      if (val > 3000) return '2s';
      if (val > 1000) return '3s';
      return '4s';
    };

    const setAnim = (key, active, reverse, speed) => {
      const el = this.querySelector(`#anim-${key}`);
      if (!el) return;
      el.style.display = active ? 'inline' : 'none';
      el.setAttribute('class', `highlight ${reverse ? 'highlight-reverse' : ''}`);
      el.style.setProperty('--duration', speed);
    };

    const setText = (key, value, unit) => {
      const el = this.querySelector(`#val-${key}`);
      if (el) {
        const formatted = this.decimalPrecision ? value.toFixed(2) : Math.round(value);
        el.textContent = `${formatted} ${unit}`;
      }
    };

    // Hàm setText cho SOC, để định dạng riêng là %
    const setSocText = (value, unit) => {
      const el = this.querySelector(`#val-soc`);
      if (el) {
        // Định dạng SOC luôn là số nguyên và thêm %
        const formatted = Math.round(value);
        el.textContent = `${formatted}%`;
      }
    };

    const setTemp = (key) => {
      const temps = c.temp || {};
      const id = temps[key];
      if (!id) return;
      const el = this.querySelector(`#val-temp-${key}`);
      const val = parseFloat(hass.states[id]?.state || 0);
      if (el) el.textContent = `${val.toFixed(1)}°C`;
    };

    setText('solar', v.solar, u.solar);
    setText('grid', v.grid, u.grid);
    setText('battery', v.battery, u.battery);
    setText('load', v.load, u.load);

    if (c.soc) { 
      setSocText(v.soc, u.soc);
    }

    if (this.showSolar2) {
      setText('solar2', v.solar2, u.solar2);
      setAnim('solar2', v.solar2 !== 0, false, getSpeed(v.solar2));
    }
    if (showMicro) {
      setText('micro', v.micro, u.micro);
      setAnim('micro', v.micro !== 0, false, getSpeed(v.micro));
    }

    setAnim('solar', v.solar !== 0, false, getSpeed(v.solar));
    setAnim('grid', v.grid !== 0, (v.grid < 0) !== !this.invertGrid, getSpeed(Math.abs(v.grid)));
    setAnim('battery', v.battery !== 0, (v.battery < 0) !== !this.invertBattery, getSpeed(Math.abs(v.battery)));
    setAnim('load', v.load !== 0, true, getSpeed(v.load));

    setTemp('ac');
    setTemp('dc');

    if (c.grid_status) {
      const state = hass.states[c.grid_status]?.state;
      const icon = state === 'on' ? '✔' : '✖';
      const color = state === 'on' ? 'green' : 'red';
      const iconEl = this.querySelector('#grid-status-symbol');
      const circleEl = this.querySelector('#grid-status-icon circle');
      if (iconEl) iconEl.textContent = icon;
      if (circleEl) circleEl.setAttribute('fill', color);
    }
  }

  _node(x, y, id, label, imgSrc, group) {
    const labelYOffset = group === 'top' ? this.labelYOffsetTop : this.labelYOffsetBottom;
    const valueYOffset = group === 'top' ? this.valueYOffsetTop : this.valueYOffsetBottom;
    const imageYOffset = group === 'top' ? this.imageYOffsetTop : this.imageYOffsetBottom;
    const imageSize = group === 'top' ? this.imageSizeTop : this.imageSizeBottom;
    const halfGap = 22;

    const labelText = id === 'battery'
      ? `<text class="label" y="${labelYOffset}" x="${-halfGap}">${label}</text>`
      : `<text class="label" y="${labelYOffset}" x="0">${label}</text>`;

    const socText = id === 'battery' && this._config.soc
      ? `<text id="val-soc" class="label" y="${labelYOffset}" x="${halfGap}">0%</text>` 
      : '';

    return `
      <g transform="translate(${x},${y})">
        ${imgSrc ? `<image href="${imgSrc}" x="${-imageSize/2}" y="${imageYOffset}" width="${imageSize}" height="${imageSize}"/>` : ''}
        ${labelText}
        ${socText}
        <text id="val-${id}" class="value" y="${valueYOffset}" x="0">0</text>
      </g>
    `;
  }

  setConfig(config) {
    this._config = config;
  }

  getCardSize() {
    return 3;
  }
}

customElements.define('tb-energy-flow-card', EnergyFlowCard);
