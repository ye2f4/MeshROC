// 第三方兼容硬件目录（汇总自 Meshtastic 官方设备文档 E:\meshtastic\docs\hardware\devices）
// 注意：以下均为社区/厂商第三方设备，非 MeshROC 自研。
// 图片路径对应 static/img/hardware/ 下已复制的资源。
// status: 'supported'（固件 boards/ 有对应 JSON）或 'developing'（暂无对应固件目标）。

const S = 'supported';
const D = 'developing';

const VENDORS = [
  {
    name: 'RAKwireless',
    note: '模块化 WisBlock 与开箱即用的 WisMesh 系列',
    devices: [
      { name: 'WisMesh Pocket V2', img: '/img/hardware/rak/pocket-v2.webp', desc: '紧凑手持终端，nRF52840 + SX1262，标配 GPS 与 BLE，适合个人与应急通信。', tags: ['nRF52840', 'SX1262', 'GPS', 'BLE'], status: S, fwBoard: 'wiscore_rak4631' },
      { name: 'WisMesh Pocket Mini', img: '/img/hardware/rak/pocket-mini.webp', desc: 'Pocket V2 的轻量版，更小巧便携，保留核心 Meshtastic 功能。', tags: ['nRF52840', '便携'], status: S, fwBoard: 'wiscore_rak4631' },
      { name: 'WisMesh Tag', img: '/img/hardware/rak/wismesh-tag.webp', desc: '纽扣式追踪标签，超长续航，用于资产与人员定位、离线消息。', tags: ['追踪', '长续航'], status: S, fwBoard: 'wiscore_rak4631' },
      { name: 'WisMesh Tap', img: '/img/hardware/rak/wismesh-tap.webp', desc: '带 E-Ink 屏的极简终端，一键收发，面向非技术用户。', tags: ['E-Ink', '易用'], status: S, fwBoard: 'wiscore_rak4631' },
      { name: 'WisMesh Board ONE', img: '/img/hardware/rak/wishmesh-board-one.webp', desc: 'WisBlock 一体化开发主板，灵活扩展传感器与接口。', tags: ['WisBlock', '开发板'], status: S, fwBoard: 'wiscore_rak4631' },
      { name: 'WisMesh 1W Booster', img: '/img/hardware/rak/wismesh-rak3401-1watt-booster-starter-kit.webp', desc: '1W 功放套件，显著提升链路距离与穿透能力。', tags: ['1W 功放', '远距离'], status: S, fwBoard: 'wiscore_rak4631' },
      { name: 'WisMesh Repeater', img: '/img/hardware/rak/wismesh-repeater.webp', desc: '外接/太阳能供电中继，扩展网络覆盖半径。', tags: ['中继', '太阳能'], status: S, fwBoard: 'wiscore_rak4631' },
      { name: 'WisMesh Repeater Mini', img: '/img/hardware/rak/wismesh-repeater-mini.webp', desc: '小型化中继节点，部署灵活、易于隐藏。', tags: ['中继', '小型'], status: S, fwBoard: 'wiscore_rak4631' },
      { name: 'WisMesh Ethernet Gateway', img: '/img/hardware/rak/wismesh-ethernet-gateway.webp', desc: '以太网网关，便于有线网络回传与固定接入。', tags: ['网关', '以太网'], status: S, fwBoard: 'wiscore_rak4631' },
      { name: 'WisMesh WiFi Gateway', img: '/img/hardware/rak/wismesh-wifi-gateway.webp', desc: 'WiFi 网关，适合室内接入与远程管理。', tags: ['网关', 'WiFi'], status: S, fwBoard: 'wiscore_rak4631' },
    ],
  },
  {
    name: 'LILYGO',
    note: 'T 系列开发板，覆盖从追踪器到掌上终端',
    devices: [
      { name: 'T-Beam S3-Core', img: '/img/hardware/T-BEAM-S3Core.webp', desc: 'ESP32-S3 + SX1262 旗舰开发板，集成 GPS，DIY 与骨干节点首选。', tags: ['ESP32-S3', 'GPS', 'DIY'], status: S, fwBoard: 'tbeam-s3-core' },
      { name: 'T-Beam SUPREME', img: '/img/hardware/T-BEAM-S3-Supreme.webp', desc: 'T-Beam 高性能版本，更强射频与续航表现。', tags: ['ESP32-S3', '高性能'], status: S, fwBoard: 't-beam-bpf' },
      { name: 'T-Echo', img: '/img/hardware/t-echo.svg', desc: '圆屏便携终端，nRF52840 + SX1262，手感与续航均衡。', tags: ['nRF52840', '圆屏'], status: S, fwBoard: 't-echo' },
      { name: 'T-Deck', img: '/img/hardware/LILYGO-T-DECK.webp', desc: '全键盘掌上终端，自带屏幕与 QWERTY 键盘，可独立聊天。', tags: ['全键盘', '掌上'], status: S, fwBoard: 't-deck' },
      { name: 'T-Lora Pager', img: '/img/hardware/LILYGO-T-LORA-PAGER.webp', desc: '类寻呼机外形的小巧终端，专注消息收发。', tags: ['寻呼机', '小巧'], status: D },
      { name: 'LoRa32 T3-S3', img: '/img/hardware/lora-t3s3.webp', desc: 'ESP32-S3 LoRa 开发板，性价比高，适合入门与扩展。', tags: ['ESP32-S3', '入门'], status: S, fwBoard: 'tlora-t3s3-v1' },
    ],
  },
  {
    name: 'HELTEC',
    note: '高集成度无线模组与节点设备',
    devices: [
      { name: 'MeshPocket', img: '/img/hardware/heltec/meshpocket.webp', desc: '口袋型 Meshtastic 终端，集成屏显与电池，开箱即用。', tags: ['便携', '屏显'], status: S, fwBoard: 'heltec_mesh_pocket' },
      { name: 'LoRa32 V4', img: '/img/hardware/heltec/heltec-V4.webp', desc: '经典 LoRa32 开发板第四代，ESP32 + SX1262。', tags: ['ESP32', '开发板'], status: S, fwBoard: 'heltec_v4' },
      { name: 'Mesh Node T114', img: '/img/hardware/heltec/Mesh_Node_T114_PIN_MAP.webp', desc: '超低功耗 nRF52 节点，适合长期离网部署（图示为引脚布局）。', tags: ['nRF52', '低功耗'], status: S, fwBoard: 'heltec_mesh_node_t114' },
      { name: 'Vision Master E213', img: '/img/hardware/heltec/HT-VME213_PIN_MAP.webp', desc: 'E-Paper 电子墨水屏节点，低功耗显示（图示为引脚布局）。', tags: ['E-Ink', '低功耗'], status: S, fwBoard: 'heltec_vision_master_e213' },
    ],
  },
  {
    name: 'Seeed Studio',
    note: '消费级追踪器与工业传感节点',
    devices: [
      { name: 'Card Tracker T1000-E', img: '/img/hardware/seeed/t1000-e-new.webp', desc: '信用卡大小的超薄追踪器，IP65 防水，定位与消息一体。', tags: ['超薄', 'IP65', 'GPS'], status: S, fwBoard: 'tracker-t1000-e' },
      { name: 'SenseCAP Indicator', img: '/img/hardware/seeed/indicator.webp', desc: '带触控屏的多功能监测终端，可显示环境与节点状态。', tags: ['触控屏', '监测'], status: S, fwBoard: 'seeed-sensecap-indicator' },
      { name: 'SenseCAP Solar Node', img: '/img/hardware/seeed/sensecap_solar_node.webp', desc: '太阳能自供电节点，免维护长期部署。', tags: ['太阳能', '免维护'], status: S, fwBoard: 'seeed_solar_node' },
      { name: 'Wio Tracker L1', img: '/img/hardware/seeed/wio_tracker_l1.webp', desc: '4G + GNSS 追踪器，支持蜂窝回传与定位。', tags: ['4G', 'GNSS'], status: S, fwBoard: 'seeed_wio_tracker_L1' },
      { name: 'XIAO + Wio-SX1262', img: '/img/hardware/seeed/esp32+1262.webp', desc: '极小尺寸 LoRa 组合，适合可穿戴与嵌入式。', tags: ['极小', '嵌入式'], status: S, fwBoard: 'seeed_xiao_nrf52840_kit' },
    ],
  },
  {
    name: 'B&Q Consulting',
    note: '工业级网关与高可靠节点',
    devices: [
      { name: 'Nano G2 Ultra', img: '/img/hardware/nano_g2_ultra.webp', desc: '高性能 Nano 节点，双射频与更强处理，面向骨干。', tags: ['双射频', '骨干'], status: S, fwBoard: 'nano-g2-ultra' },
      { name: 'Station G2', img: '/img/hardware/station-series/station-g2-front.webp', desc: 'Station 系列固定站点，外接天线与供电，稳定中继。', tags: ['固定站点', '中继'], status: S, fwBoard: 'station-g2' },
    ],
  },
  {
    name: 'Elecrow',
    note: '模块化节点与人机交互面板',
    devices: [
      { name: 'ThinkNode M1', img: '/img/hardware/elecrow/Thinknode-m1_for_Meshtastic.webp', desc: 'ThinkNode 入门节点，集成屏显与电池。', tags: ['入门', '屏显'], status: S, fwBoard: 'ThinkNode-M1' },
      { name: 'ThinkNode M2', img: '/img/hardware/elecrow/Thinknode-m2_for_Meshtastic.webp', desc: 'ThinkNode 进阶节点，更强射频与扩展能力。', tags: ['进阶'], status: D },
      { name: 'ThinkNode M3', img: '/img/hardware/elecrow/thinknode_m3_tracker_for_meshtastic.webp', desc: 'ThinkNode 追踪版，定位与消息兼顾。', tags: ['追踪'], status: S, fwBoard: 'ThinkNode-M3' },
      { name: 'CrowPanel', img: '/img/hardware/elecrow/esp32_advance_hmi_3_5.webp', desc: '3.5" 触控 HMI 面板，可做消息站与控制台。', tags: ['触控面板', 'HMI'], status: S, fwBoard: 'crowpanel' },
    ],
  },
  {
    name: 'muzi works',
    note: '一体化设计与开发底座',
    devices: [
      { name: 'R1 Neo', img: '/img/hardware/muzi/muziworks-r1-neo.webp', desc: '一体化 Meshtastic 终端，精致外壳与屏显。', tags: ['一体化', '屏显'], status: S, fwBoard: 'r1-neo' },
      { name: 'BASE Uno', img: '/img/hardware/muzi/base-uno.webp', desc: 'BASE 开发底座 Uno，模块化扩展核心。', tags: ['开发底座', '模块'], status: S, fwBoard: 'muzi-base' },
      { name: 'BASE Duo', img: '/img/hardware/muzi/base-duo.webp', desc: 'BASE 开发底座 Duo，双模块高性能扩展。', tags: ['开发底座', '双模块'], status: D },
    ],
  },
  {
    name: 'Raspberry Pi',
    note: '生态开发板',
    devices: [
      { name: 'Pico (RP2040)', img: null, desc: '基于 RP2040 的低成本开发板，可用于自定义外设与桥接。', tags: ['RP2040', 'DIY'], status: D },
    ],
  },
  {
    name: 'Community Supported',
    note: '社区自发开源项目',
    devices: [
      { name: 'unPhone', img: '/img/hardware/unPhone/unphone-front-with-expander.webp', desc: '开源全功能手机雏形，ESP32 + 蜂窝，社区驱动。', tags: ['开源手机', 'ESP32'], status: S, fwBoard: 'unphone' },
      { name: 'Chatter', img: '/img/hardware/chatter.webp', desc: '开源硬件聊天终端，专注安全通信。', tags: ['开源', '安全'], status: D },
      { name: 'T-Watch S3', img: '/img/hardware/LILYGO-T-Watch-S3.webp', desc: 'LILYGO 智能手表形态 Meshtastic 终端。', tags: ['手表', '便携'], status: S, fwBoard: 't-watch-s3' },
    ],
  },
];

// 首页精选（跨厂商的代表性设备）
const HIGHLIGHTS = [
  VENDORS[0].devices[0], // RAK WisMesh Pocket V2
  VENDORS[3].devices[0], // Seeed T1000-E
  VENDORS[2].devices[0], // HELTEC MeshPocket
  VENDORS[1].devices[4], // LILYGO T-Lora Pager
  VENDORS[4].devices[0], // B&Q Nano G2 Ultra
  VENDORS[4].devices[1], // B&Q Station G2
  VENDORS[6].devices[0], // muzi R1 Neo
  VENDORS[8].devices[0], // Community unPhone
  VENDORS[8].devices[1], // Community Chatter
];

export { VENDORS, HIGHLIGHTS };
