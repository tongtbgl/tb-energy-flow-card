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
show_micro: false
show_solar2: true
solar: sensor.tong_pv_hybrid
solar2: sensor.esp_inverter_aux_power
grid: sensor.esp_inverter_grid_ct_power
battery: sensor.esp_inverter_battery_power
entity_micro: sensor.esp_inverter_aux_power
load: sensor.esp_inverter_load_power
soc: sensor.soc_giao_tiep
grid_status: binary_sensor.esp_inverter_grid_connected_status
grid_status_x: 520
grid_status_y: 180
name_solar: Hybrid
name_solar2: On Grid
name_grid: Lưới EVN
name_battery: Pin
name_micro: Deye OnGrid
name_load: Sử dụng
image_solar: >-
  https://cdn3d.iconscout.com/3d/premium/thumb/solar-panel-system-6814926-5602608.png
image_solar2: https://tpenergy.com.vn/wp-content/uploads/2023/10/3-1-1.png
image_grid: >-
  https://cdn3d.iconscout.com/3d/premium/thumb/transmission-tower-6477336-5559823.png
image_battery: https://cdn3d.iconscout.com/3d/premium/thumb/car-battery-15130326-12271944.png
image_micro: https://tpenergy.com.vn/wp-content/uploads/2023/10/3-1-1.png
image_load: https://bachtran.net/ha/img/home.png
inverter_image: https://hungvietgt.com/upload/image/sanpham/huawei/sun20005-6k-lb0.png
line_color: "#000"
line_width: 3
dot_color: "#34a4eb"
dot_size: 15
invert_grid: true
invert_battery: true
decimal_precision: false
animation_duration: auto
image_y_offset_top: -50
image_y_offset_bottom: -50
image_size_top: 80
image_size_bottom: 80
inverter_image_width: 200
inverter_image_height: 200
label_y_offset_top: -50
value_y_offset_top: -75
label_y_offset_bottom: 95
value_y_offset_bottom: 70
font_size_label: 15
font_size_value: 25
temp:
  ac: sensor.esp_inverter_radiator_temperature
  dc: sensor.esp_inverter_dc_transformer_temperature
temp_position:
  ac:
    x: 430
    "y": 330
  dc:
    x: 170
    "y": 330
temp_font:
  size: 15
  weight: normal
today:
  product: sensor.tong_san_luong_ngay
  import: sensor.esp_inverter_day_grid_import
  export: sensor.esp_inverter_day_grid_export
  charge: sensor.esp_inverter_day_battery_charge
  discharge: sensor.esp_inverter_day_battery_discharge
  load: sensor.tong_tieu_thu
today_labels:
  product: SL
  import: Mua
  export: Bán
  charge: Sạc
  discharge: Xả
  load: Tải
today_font:
  label_size: 13
  size: 13
  weight: normal
  label_y_offset: -12
  value_y_offset: 10
  align: mid
today_position:
  product:
    x: 130
    "y": 170
  import:
    x: 460
    "y": 160
  export:
    x: 460
    "y": 185
  charge:
    x: 130
    "y": 420
  discharge:
    x: 128
    "y": 445
  load:
    x: 470
    "y": 430
card_mod:
  style: |
    ha-card {
      background: transparent !important;
      box-shadow: none !important;
    }
    .card-container {
      background: transparent !important;
      box-shadow: none !important;
      padding: 0px !important; 
    }

```
## Các kiểu hiển thị khác

### Có 2 PV
![preview](preview2.png)

Cách làm là thay đổi link hình ảnh và thực thể của micro inverter thành hình ảnh của String PV với thực thể PV2

### Không có micro inverter
![preview](preview3.png)

Cách làm chỉnh lại `show_micro: true` thành `show_micro: false`


## Tùy chỉnh
Các bạn có thể tùy chỉnh các thông số
| Tùy chọn                | Mô tả                                                      |
| ----------------------- | ---------------------------------------------------------- |
| `entities`              | Định nghĩa các thực thể: solar, grid, battery, micro, load |
| `name`                  | Tên hiển thị cho từng thành phần                           |
| `invert_grid`           | Đảo chiều animation của dòng điện lưới                     |
| `invert_battery`        | Đảo chiều animation của pin                                |
| `line_color`            | Màu của đường dẫn điện (mặc định: cam)                     |
| `dot_color`             | Màu của chấm tròn                                          |
| `dot_size`              | Kích thước của chấm tròn                                   |
| `image_y_offset_top`    | Dịch chuyển trục Y nhóm hình ảnh phía trên                 |
| `image_y_offset_bottom` | Dịch chuyển trục Y nhóm hình ảnh phía dưới                 |
| `image_size_top`        | Kích thước hình ảnh nhóm trên                              |
| `image_size_bottom`     | Kích thước hình ảnh nhóm dưới                              |
| `font_size_label`       | Cỡ chữ của nhãn                                            |
| `font_size_value`       | Cỡ chữ của giá trị                                         |
| `font_weight_value`     | Độ đậm chữ số liệu                                         |
| `decimal_precision`     | Số chữ số thập phân hiển thị                               |
| `show_micro`            | Cho hiển thị micro inverter                                |
| `show_solar2`           | Cho hiển thị thêm string PV                                |

# Ủng hộ tôi để có thêm động lực phát triển:
https://bachtran.net/donate/
Cảm ơn các bạn
