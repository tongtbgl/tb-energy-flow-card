# 🧭 tb-energy-flow-card

Hiển thị trực quan dòng điện năng lượng mặt trời trong Home Assistant. Hỗ trợ inverter, lưới, pin, vi mô, tải với hoạt ảnh sinh động theo hướng dòng điện.

![preview](preview.png)

## 🔧 Tính năng chính

- Sơ đồ năng lượng dạng SVG với layout cố định, đẹp mắt.
- Hiển thị 5 thành phần: Solar, Grid, Battery, Micro Inverter, Load.
- Hoạt ảnh dòng điện chạy theo chiều thực tế, có thể đảo chiều với Grid và Battery.
- Line và highlight có thể tùy chỉnh màu sắc.
- Hỗ trợ Dark mode.
- Cho phép đổi tên, biểu tượng, hình ảnh, font size, vị trí từng thành phần.
- Hỗ trợ ảnh Inverter trung tâm và tùy chỉnh kích thước.

## ⚙️ Cài đặt

1. Tải file `tb-energy-flow-card.js` về và đặt vào thư mục `/config/www/` trong Home Assistant.
2. Thêm vào `resources` thông qua UI hoặc `configuration.yaml`:

```yaml
resources:
  - url: /local/tb-energy-flow-card.js
    type: module
```

## Code mẫu
```yaml
type: custom:tb-energy-flow-card
show_micro: true
solar: sensor.tong_pv_hybrid
glow_size: 8
grid: sensor.esp_inverter_grid_ct_power
battery: sensor.esp_inverter_battery_power
entity_micro: sensor.esp_inverter_aux_power
load: sensor.esp_inverter_load_power
soc: sensor.soc_giao_tiep
grid_status: binary_sensor.esp_inverter_grid_connected_status
grid_status_x: 520
grid_status_y: 180
name_solar: Quang điện
name_grid: Lưới EVN
name_battery: Pin
name_micro: Deye OnGrid
name_load: Tải nhà
image_solar: >-
  https://png.pngtree.com/png-vector/20240720/ourmid/pngtree-sustainable-solar-water-pump-on-transparent-background-png-image_12963933.png
image_grid: >-
  https://png.pngtree.com/png-vector/20250105/ourmid/pngtree-d-model-of-a-steel-transmission-tower-with-power-lines-on-png-image_15054625.png
image_battery: https://bachtran.net/ha/img/battery.png
image_micro: https://tpenergy.com.vn/wp-content/uploads/2023/10/3-1-1.png
image_load: https://bachtran.net/ha/img/home.png
inverter_image: https://bachtran.net/wp-content/uploads/2025/07/deye1.png
line_color: "#dfdfdf"
line_width: 3
highlight_color: red
invert_grid: true
invert_battery: true
decimal_precision: false
highlight_length: 60
animation_duration: auto
image_y_offset_top: -50
image_y_offset_bottom: -95
image_size_top: 100
image_size_bottom: 150
inverter_image_width: 800
inverter_image_height: 200
label_y_offset_top: -50
value_y_offset_top: -75
label_y_offset_bottom: 90
value_y_offset_bottom: 65
font_size_label: 18
font_size_value: 25
font_weight_value: 1000
temp:
  ac: sensor.esp_inverter_radiator_temperature
  dc: sensor.esp_inverter_dc_transformer_temperature
temp_position:
  ac:
    x: 390
    "y": 340
  dc:
    x: 215
    "y": 340
temp_font:
  size: 15
  weight: normal

```
