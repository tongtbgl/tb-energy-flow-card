class EnergyFlowCard extends HTMLElement {
  connectedCallback() {
    const c = this._config;
    this.lineWidth = c.line_width || 3;
    this.lineColor = c.line_color || 'gray';
    this.dotColor = c.dot_color || 'orange';
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
    this.fontWeightValue = c.fontWeightValue || 'bold';

    this.decimalPrecision = c.decimal_precision !== false;

    this.dotSize = c.dot_size || 8;
    this.animationDurationConfig = c.animation_duration || '3s';

    const showMicro = c.show_micro !== false;
    this.showSolar2 = c.show_solar2 === true;

    const temps = c.temp || {};
    const tempPos = c.temp_position || {};
    const tempFont = c.temp_font || {};

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
        }
        .card-container {
          background-color: transparent;
          border-radius: var(--ha-card-border-radius, 12px);
          padding: 16px;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
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
        .flow-dot {
          fill: ${this.dotColor};
          filter: drop-shadow(0 0 ${this.glowSize}px ${this.dotColor});
        }
      </style>
      <div class="card-container">
        <svg viewBox="0 0 600 600" width="100%" height="100%">
          <defs>
            <path id="solar-path" d="M 80,100 L 80,230 A 20,20 0 0,0 100,250 L 300,250 L 300,300"/>
            <path id="grid-path" d="M 520,100 L 520,230 A 20,20 0 0,1 500,250 L 300,250 L 300,300"/>
            <path id="battery-path" d="M 80,500 L 80,370 A 20,20 0 0,1 100,350 L 300,350 L 300,300"/>
            <path id="load-path" d="M 520,500 L 520,370 A 20,20 0 0,0 500,350 L 300,350 L 300,300"/>
            ${this.showSolar2 ? `<path id="solar2-path" d="M 300,100 L 300,300"/>` : ''}
            ${showMicro ? `<path id="micro-path" d="M 300,500 L 300,300"/>` : ''}
          </defs>

          <use href="#solar-path" class="path-line"/>
          <use href="#grid-path" class="path-line"/>
          <use href="#battery-path" class="path-line"/>
          <use href="#load-path" class="path-line"/>
          ${this.showSolar2 ? `<use href="#solar2-path" class="path-line"/>` : ''}
          ${showMicro ? `<use href="#micro-path" class="path-line"/>` : ''}

          <circle id="dot-solar" class="flow-dot" r="${this.dotSize / 2}" style="display: none;"/>
          <circle id="dot-grid" class="flow-dot" r="${this.dotSize / 2}" style="display: none;"/>
          <circle id="dot-battery" class="flow-dot" r="${this.dotSize / 2}" style="display: none;"/>
          <circle id="dot-load" class="flow-dot" r="${this.dotSize / 2}" style="display: none;"/>
          ${this.showSolar2 ? `<circle id="dot-solar2" class="flow-dot" r="${this.dotSize / 2}" style="display: none;"/>` : ''}
          ${showMicro ? `<circle id="dot-micro" class="flow-dot" r="${this.dotSize / 2}" style="display: none;"/>` : ''}

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
      </div>
    `;

    this._dots = {};
    this._animationFrame = null;
    this._lastAnimateTime = null;
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
      soc: getVal(c.soc),
    };

    const u = {
      solar: getUnit(c.solar),
      grid: getUnit(c.grid),
      battery: getUnit(c.battery),
      micro: showMicro ? getUnit(c.entity_micro) : '',
      solar2: this.showSolar2 ? getUnit(c.solar2) : '',
      load: getUnit(c.load),
      soc: getUnit(c.soc),
    };

    const getSpeed = (val) => {
      if (this.animationDurationConfig !== 'auto') return parseFloat(this.animationDurationConfig.replace('s', '')); // convert '3s' to 3
      if (val > 3000) return 2;
      if (val > 1000) return 3;
      return 4;
    };

    const setupDotAnimation = (key, value, reverse) => {
      const dotEl = this.querySelector(`#dot-${key}`);
      const pathEl = this.querySelector(`#${key}-path`);
      if (!dotEl || !pathEl) return;

      if (!this._dots[key]) {
        this._dots[key] = {
          element: dotEl,
          path: pathEl,
          pathLength: pathEl.getTotalLength(),
          currentPos: 0,
          active: false,
          speed: 0,
          reverse: false,
        };
      }

      const dotState = this._dots[key];
      dotState.active = value !== 0;
      dotState.reverse = reverse;
      dotState.speed = dotState.pathLength / getSpeed(Math.abs(value));

      dotEl.style.display = dotState.active ? 'inline' : 'none';
    };

    const setText = (key, value, unit) => {
      const el = this.querySelector(`#val-${key}`);
      if (el) {
        const formatted = this.decimalPrecision ? value.toFixed(2) : Math.round(value);
        el.textContent = `${formatted} ${unit}`;
      }
    };

    const setSocText = (value, unit) => {
      const el = this.querySelector(`#val-soc`);
      if (el) {
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

    setupDotAnimation('solar', v.solar, false);
    setupDotAnimation('grid', v.grid, (v.grid < 0) !== !this.invertGrid);
    setupDotAnimation('battery', v.battery, (v.battery < 0) !== !this.invertBattery);
    setupDotAnimation('load', v.load, true);
    if (this.showSolar2) {
      setText('solar2', v.solar2, u.solar2);
      setupDotAnimation('solar2', v.solar2, false);
    }
    if (showMicro) {
      setText('micro', v.micro, u.micro);
      setupDotAnimation('micro', v.micro, false);
    }

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

    if (!this._animationFrame) {
      this._animationFrame = requestAnimationFrame(this._animateDots.bind(this));
    }
  }

  _animateDots(timestamp) {
    if (!this._lastAnimateTime) {
      this._lastAnimateTime = timestamp;
    }
    const deltaTime = (timestamp - this._lastAnimateTime) / 1000;
    this._lastAnimateTime = timestamp;

    for (const key in this._dots) {
      const dot = this._dots[key];
      if (dot.active) {
        let newPos = dot.currentPos;
        if (dot.reverse) {
          newPos -= dot.speed * deltaTime;
          if (newPos < 0) {
            newPos += dot.pathLength;
          }
        } else {
          newPos += dot.speed * deltaTime;
          if (newPos > dot.pathLength) {
            newPos -= dot.pathLength;
          }
        }
        dot.currentPos = newPos;

        const point = dot.path.getPointAtLength(dot.currentPos);
        dot.element.setAttribute('cx', point.x);
        dot.element.setAttribute('cy', point.y);
      }
    }

    this._animationFrame = requestAnimationFrame(this._animateDots.bind(this));
  }

  disconnectedCallback() {
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
      this._animationFrame = null;
    }
    this._dots = {};
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
