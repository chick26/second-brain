---
excalidraw-plugin: parsed
tags: [excalidraw]
---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠==


# Text Elements
事务 ^KeUGCAUo

开始事务 ^Vpt2YyI2

更新数据 ^lL3GG48N

写入 redo log
（prepare） ^QYIQD3VV

重做日志缓存
(redo log buffer) ^TPykBDUQ

写入 ^Kg5yS7XK

文件系统缓存
(page cache) ^VJLGLOzH

写入 ^08UUpdoC

后台线程 ^QwGCYinl

每隔 1s ，会把 redo log buffer 中的内容
写到 page cache, 后调用 fsync 刷盘 ^bsoQrJVI

redolog file ^aBUv1Egi

刷盘 ^Andxkyz4

硬盘 ^wSc6xuiq

提交事务 ^LzfwzY4d

写入 bin log ^jlmFX7vr

写入 redo log
（commit） ^YINOSuw9

主动刷盘 ^7yjHwSnc

InnoDB 存储引擎层 ^dMeiMwTF

Prepare ^GanLseQZ

Commit ^Xb33O91b

阶
段
更
新 ^g3gSjRgg

Server 层 ^hFUOUvxO

文件系统缓存
(page cache) ^0y2ZGghT

binlog file ^bpL8BHuO

%%
# Drawing
```json
{
	"type": "excalidraw",
	"version": 2,
	"source": "https://excalidraw.com",
	"elements": [
		{
			"type": "rectangle",
			"version": 984,
			"versionNonce": 1691952538,
			"isDeleted": false,
			"id": "PKxhJDSQ5jMn8Mz62van5",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -903.7710830441085,
			"y": -268.6121483387855,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 211.14835122065634,
			"height": 519.1213533857621,
			"seed": 1489320475,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620554,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 357,
			"versionNonce": 1290344710,
			"isDeleted": false,
			"id": "KeUGCAUo",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -826.8714919196246,
			"y": -252.61559048866746,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 45,
			"height": 32,
			"seed": 982960437,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620554,
			"link": null,
			"locked": false,
			"fontSize": 22.121070777170285,
			"fontFamily": 1,
			"text": "事务",
			"rawText": "事务",
			"baseline": 24,
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "事务"
		},
		{
			"type": "rectangle",
			"version": 511,
			"versionNonce": 613769818,
			"isDeleted": false,
			"id": "IUSHqidLCWkoI6UKq71LG",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -869.2266207687966,
			"y": -208.10377792914448,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 131,
			"height": 43,
			"seed": 799728283,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [
				{
					"type": "text",
					"id": "Vpt2YyI2"
				},
				{
					"id": "097UlXnPAcZXidAyKrMfr",
					"type": "arrow"
				}
			],
			"updated": 1662104620554,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 583,
			"versionNonce": 598476870,
			"isDeleted": false,
			"id": "Vpt2YyI2",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -864.2266207687966,
			"y": -196.60377792914448,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 121,
			"height": 20,
			"seed": 1829407675,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620554,
			"link": null,
			"locked": false,
			"fontSize": 15.52386107521644,
			"fontFamily": 1,
			"text": "开始事务",
			"rawText": "开始事务",
			"baseline": 14,
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "IUSHqidLCWkoI6UKq71LG",
			"originalText": "开始事务"
		},
		{
			"type": "rectangle",
			"version": 689,
			"versionNonce": 1126958874,
			"isDeleted": false,
			"id": "mmdCK8Y-op3sTQN4xe6ls",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -870.4869638850612,
			"y": -136.29871440214595,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 136,
			"height": 38,
			"seed": 675573525,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [
				{
					"id": "lL3GG48N",
					"type": "text"
				},
				{
					"id": "VwijJKlutdySyfyHscqtD",
					"type": "arrow"
				},
				{
					"id": "097UlXnPAcZXidAyKrMfr",
					"type": "arrow"
				}
			],
			"updated": 1662104620554,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 776,
			"versionNonce": 1523519366,
			"isDeleted": false,
			"id": "lL3GG48N",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -865.4869638850612,
			"y": -127.29871440214595,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 126,
			"height": 20,
			"seed": 1070430395,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620554,
			"link": null,
			"locked": false,
			"fontSize": 15.52386107521644,
			"fontFamily": 1,
			"text": "更新数据",
			"rawText": "更新数据",
			"baseline": 14,
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "mmdCK8Y-op3sTQN4xe6ls",
			"originalText": "更新数据"
		},
		{
			"type": "rectangle",
			"version": 600,
			"versionNonce": 1225790426,
			"isDeleted": false,
			"id": "49rSobvlrcIXqMmUAPXeU",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -873.2972078778226,
			"y": -68.515445750632,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 144,
			"height": 51,
			"seed": 145109845,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [
				{
					"id": "QYIQD3VV",
					"type": "text"
				},
				{
					"id": "VwijJKlutdySyfyHscqtD",
					"type": "arrow"
				},
				{
					"id": "Kj6VVFAOm1YqZlmQDN4ZH",
					"type": "arrow"
				},
				{
					"id": "UPf5OHnRF3ONpV2mKGDvJ",
					"type": "arrow"
				}
			],
			"updated": 1662104620554,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 738,
			"versionNonce": 512700102,
			"isDeleted": false,
			"id": "QYIQD3VV",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -868.2972078778226,
			"y": -63.015445750632,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 134,
			"height": 40,
			"seed": 1653151867,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620554,
			"link": null,
			"locked": false,
			"fontSize": 15.533042817567644,
			"fontFamily": 1,
			"text": "写入 redo log\n（prepare）",
			"rawText": "写入 redo log\n（prepare）",
			"baseline": 34,
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "49rSobvlrcIXqMmUAPXeU",
			"originalText": "写入 redo log\n（prepare）"
		},
		{
			"type": "arrow",
			"version": 841,
			"versionNonce": 945064090,
			"isDeleted": false,
			"id": "097UlXnPAcZXidAyKrMfr",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -805.7070602035291,
			"y": -162.37333841261628,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 2.1647347232282073,
			"height": 24.646350509861662,
			"seed": 639763669,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620554,
			"link": null,
			"locked": false,
			"startBinding": {
				"elementId": "IUSHqidLCWkoI6UKq71LG",
				"gap": 2.730439516528209,
				"focus": 0.06096961558487036
			},
			"endBinding": {
				"elementId": "mmdCK8Y-op3sTQN4xe6ls",
				"gap": 1.4282735006086706,
				"focus": 0.010605773848813114
			},
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": "arrow",
			"points": [
				[
					0,
					0
				],
				[
					2.1647347232282073,
					24.646350509861662
				]
			]
		},
		{
			"type": "arrow",
			"version": 1025,
			"versionNonce": 193553926,
			"isDeleted": false,
			"id": "VwijJKlutdySyfyHscqtD",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -797.7860270728629,
			"y": -96.95227093260483,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 0.9395138657198459,
			"height": 27.422328266259612,
			"seed": 593212821,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620554,
			"link": null,
			"locked": false,
			"startBinding": {
				"elementId": "mmdCK8Y-op3sTQN4xe6ls",
				"gap": 1.3464434695411112,
				"focus": -0.058321826013092375
			},
			"endBinding": {
				"elementId": "49rSobvlrcIXqMmUAPXeU",
				"gap": 1.014496915713236,
				"focus": 0.07353968379641175
			},
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": "arrow",
			"points": [
				[
					0,
					0
				],
				[
					0.9395138657198459,
					27.422328266259612
				]
			]
		},
		{
			"type": "arrow",
			"version": 1421,
			"versionNonce": 1487693146,
			"isDeleted": false,
			"id": "UPf5OHnRF3ONpV2mKGDvJ",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -795.1683520276771,
			"y": -1.5154457506319972,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 0.7597734274012282,
			"height": 21.168899331969627,
			"seed": 1068957467,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620554,
			"link": null,
			"locked": false,
			"startBinding": {
				"elementId": "49rSobvlrcIXqMmUAPXeU",
				"gap": 16,
				"focus": -0.06362564210652667
			},
			"endBinding": {
				"elementId": "KL6f8TsaVNo63beofM-bY",
				"gap": 9.121767367209612,
				"focus": 0.07839009111685254
			},
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": "arrow",
			"points": [
				[
					0,
					0
				],
				[
					0.7597734274012282,
					21.168899331969627
				]
			]
		},
		{
			"type": "rectangle",
			"version": 141,
			"versionNonce": 582661446,
			"isDeleted": false,
			"id": "LspK9rlr1ksCxdxN3XUVp",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -580.9849897481135,
			"y": -81.68693421392709,
			"strokeColor": "#000",
			"backgroundColor": "#fa5252",
			"width": 204,
			"height": 64.4261731551606,
			"seed": 160842235,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [
				{
					"type": "text",
					"id": "TPykBDUQ"
				},
				{
					"id": "VET4DUt24fQtfqueyWehZ",
					"type": "arrow"
				},
				{
					"id": "Kj6VVFAOm1YqZlmQDN4ZH",
					"type": "arrow"
				},
				{
					"id": "DAX-q0n8Le8TC9FHTQGbe",
					"type": "arrow"
				}
			],
			"updated": 1662104620554,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 116,
			"versionNonce": 57322010,
			"isDeleted": false,
			"id": "TPykBDUQ",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -575.9849897481135,
			"y": -69.47384763634679,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 194,
			"height": 40,
			"seed": 1474663323,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620554,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 1,
			"text": "重做日志缓存\n(redo log buffer)",
			"rawText": "重做日志缓存\n(redo log buffer)",
			"baseline": 34,
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "LspK9rlr1ksCxdxN3XUVp",
			"originalText": "重做日志缓存\n(redo log buffer)"
		},
		{
			"type": "arrow",
			"version": 450,
			"versionNonce": 1031806086,
			"isDeleted": false,
			"id": "Kj6VVFAOm1YqZlmQDN4ZH",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -727.9638931082873,
			"y": -44.963572944898424,
			"strokeColor": "#000",
			"backgroundColor": "#fa5252",
			"width": 145.96440644446045,
			"height": 1.3901177118902552,
			"seed": 592002421,
			"groupIds": [
				"weHDUxs6bYRLGu_1SWGN1"
			],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620554,
			"link": null,
			"locked": false,
			"startBinding": {
				"elementId": "49rSobvlrcIXqMmUAPXeU",
				"gap": 1.3333147695353647,
				"focus": -0.0477254472020825
			},
			"endBinding": {
				"elementId": "LspK9rlr1ksCxdxN3XUVp",
				"gap": 1.014496915713236,
				"focus": -0.06446022061502149
			},
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": "arrow",
			"points": [
				[
					0,
					0
				],
				[
					145.96440644446045,
					-1.3901177118902552
				]
			]
		},
		{
			"type": "text",
			"version": 21,
			"versionNonce": 1870812890,
			"isDeleted": false,
			"id": "Kg5yS7XK",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -671.4608519314063,
			"y": -76.95898254096511,
			"strokeColor": "#000",
			"backgroundColor": "#fa5252",
			"width": 33,
			"height": 23,
			"seed": 519712245,
			"groupIds": [
				"weHDUxs6bYRLGu_1SWGN1"
			],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620554,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 1,
			"text": "写入",
			"rawText": "写入",
			"baseline": 17,
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "写入"
		},
		{
			"type": "rectangle",
			"version": 451,
			"versionNonce": 26647494,
			"isDeleted": false,
			"id": "bmhffoFi0BzShyRkFSRiG",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -581.3073117385131,
			"y": 135.86187193909083,
			"strokeColor": "#000",
			"backgroundColor": "#fa5252",
			"width": 204,
			"height": 64.4261731551606,
			"seed": 610608117,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [
				{
					"id": "VJLGLOzH",
					"type": "text"
				},
				{
					"id": "VET4DUt24fQtfqueyWehZ",
					"type": "arrow"
				},
				{
					"id": "469dz5WLht4eqS5oBgvkc",
					"type": "arrow"
				},
				{
					"id": "sgi_DaVzFCHvR6nhEViVs",
					"type": "arrow"
				}
			],
			"updated": 1662104620554,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 487,
			"versionNonce": 2105961370,
			"isDeleted": false,
			"id": "VJLGLOzH",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -576.3073117385131,
			"y": 148.07495851667113,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 194,
			"height": 40,
			"seed": 451346907,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620554,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 1,
			"text": "文件系统缓存\n(page cache)",
			"rawText": "文件系统缓存\n(page cache)",
			"baseline": 34,
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "bmhffoFi0BzShyRkFSRiG",
			"originalText": "文件系统缓存\n(page cache)"
		},
		{
			"type": "arrow",
			"version": 709,
			"versionNonce": 1427845894,
			"isDeleted": false,
			"id": "VET4DUt24fQtfqueyWehZ",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -479.1619502766171,
			"y": -16.26076105876649,
			"strokeColor": "#000",
			"backgroundColor": "#fa5252",
			"width": 0.45020224372183293,
			"height": 149.26369676259975,
			"seed": 41165141,
			"groupIds": [
				"0nQb4J3rW1cUeFlGKkhwg"
			],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620554,
			"link": null,
			"locked": false,
			"startBinding": {
				"elementId": "LspK9rlr1ksCxdxN3XUVp",
				"gap": 1,
				"focus": 0.0007520753417597686
			},
			"endBinding": {
				"elementId": "bmhffoFi0BzShyRkFSRiG",
				"gap": 2.8589362352575733,
				"focus": -0.004021888492885889
			},
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": "arrow",
			"points": [
				[
					0,
					0
				],
				[
					-0.45020224372183293,
					149.26369676259975
				]
			]
		},
		{
			"type": "text",
			"version": 21,
			"versionNonce": 61466714,
			"isDeleted": false,
			"id": "08UUpdoC",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -455.3974223562883,
			"y": 6.222533815588633,
			"strokeColor": "#000",
			"backgroundColor": "#fa5252",
			"width": 33,
			"height": 23,
			"seed": 688241627,
			"groupIds": [
				"0nQb4J3rW1cUeFlGKkhwg"
			],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620554,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 1,
			"text": "写入",
			"rawText": "写入",
			"baseline": 17,
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "写入"
		},
		{
			"type": "freedraw",
			"version": 129,
			"versionNonce": 1384833606,
			"isDeleted": false,
			"id": "fFAX3rlL32zbgf5f-uLfq",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -353.18278602848045,
			"y": -52.376073757816414,
			"strokeColor": "#000",
			"backgroundColor": "#fa5252",
			"width": 29.595852207006942,
			"height": 29.509272434582783,
			"seed": 2053301461,
			"groupIds": [
				"YFANPKnAsrun7h8qCEu0O"
			],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620554,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					-0.21284194054283034,
					-1.3877787807814457e-17
				],
				[
					-0.21284194054283032,
					-0.4256838810856607
				],
				[
					-0.21284194054283045,
					-1.2337617570448742
				],
				[
					-0.6385258216284916,
					-1.4466036975877046
				],
				[
					-0.638525821628491,
					-2.9509272434582954
				],
				[
					-0.6385258216284908,
					-3.1637691840011257
				],
				[
					-0.638525821628491,
					-3.9718470599603393
				],
				[
					-0.6385258216284919,
					-4.779924935919553
				],
				[
					-0.6385258216284906,
					-5.588002811878823
				],
				[
					-0.638525821628491,
					-7.092326357749357
				],
				[
					-0.6385258216284901,
					-7.900404233708571
				],
				[
					-0.638525821628491,
					-8.708482109667841
				],
				[
					-0.638525821628491,
					-9.134165990753502
				],
				[
					-0.638525821628491,
					-9.347007931296332
				],
				[
					0.11183220604789312,
					-10.851331477166866
				],
				[
					0.4870112198860852,
					-12.3556550230374
				],
				[
					0.9090876104540939,
					-12.56849696358023
				],
				[
					0.9090876104540939,
					-12.994180844665891
				],
				[
					1.1183220604792723,
					-13.207022785208721
				],
				[
					1.1183220604792723,
					-13.845548606837212
				],
				[
					1.540398451047281,
					-14.0583905473801
				],
				[
					1.807352749355232,
					-14.866468423339313
				],
				[
					2.0165871993804103,
					-15.292152304424974
				],
				[
					2.2258216494055887,
					-15.504994244967804
				],
				[
					2.7633377365391425,
					-16.313072120927018
				],
				[
					3.3008538236726963,
					-17.121149996886288
				],
				[
					3.5100882736978747,
					-17.33399193742912
				],
				[
					4.047604360831542,
					-18.142069813388332
				],
				[
					4.797962388507926,
					-19.646393359258866
				],
				[
					5.220038779075935,
					-20.072077240344584
				],
				[
					5.429273229101113,
					-20.284919180887414
				],
				[
					5.638507679126292,
					-20.497761121430244
				],
				[
					5.905461977434243,
					-21.305838997389458
				],
				[
					6.114696427459421,
					-21.305838997389458
				],
				[
					6.323930877484486,
					-21.518680937932288
				],
				[
					8.080778759592363,
					-22.839022467401378
				],
				[
					8.502855150160372,
					-23.264706348487096
				],
				[
					9.628392191674948,
					-24.39385088051938
				],
				[
					10.050468582242956,
					-24.81953476160504
				],
				[
					10.854938967684575,
					-25.36065833925636
				],
				[
					11.27701535825247,
					-25.78634222034202
				],
				[
					12.777731413605352,
					-26.540307738536114
				],
				[
					14.004278189614979,
					-27.294273256730207
				],
				[
					14.808748575056484,
					-27.564835045555867
				],
				[
					15.230824965624493,
					-27.564835045555867
				],
				[
					16.035295351065997,
					-28.10595862320713
				],
				[
					16.244529801091176,
					-28.10595862320713
				],
				[
					16.453764251116354,
					-28.10595862320713
				],
				[
					17.258234636557972,
					-28.647082200858392
				],
				[
					17.680311027125867,
					-28.647082200858392
				],
				[
					18.102387417693876,
					-28.859924141401223
				],
				[
					18.906857803135495,
					-29.130485930226882
				],
				[
					20.407573858488377,
					-29.509272434582783
				],
				[
					20.61680830851344,
					-29.509272434582783
				],
				[
					21.03888469908145,
					-29.509272434582783
				],
				[
					21.24811914910663,
					-29.509272434582783
				],
				[
					22.052589534548247,
					-29.509272434582783
				],
				[
					22.26182398457331,
					-29.509272434582783
				],
				[
					22.8931348251665,
					-29.509272434582783
				],
				[
					24.119681601176012,
					-29.509272434582783
				],
				[
					25.620397656528894,
					-29.509272434582783
				],
				[
					26.042474047096903,
					-29.509272434582783
				],
				[
					26.46455043766491,
					-29.509272434582783
				],
				[
					26.88662682823292,
					-29.509272434582783
				],
				[
					27.691097213674425,
					-29.509272434582783
				],
				[
					28.113173604242434,
					-29.509272434582783
				],
				[
					28.535249994810442,
					-29.509272434582783
				],
				[
					28.95732638537845,
					-29.509272434582783
				],
				[
					28.95732638537845,
					-29.509272434582783
				]
			],
			"lastCommittedPoint": null,
			"simulatePressure": true,
			"pressures": []
		},
		{
			"type": "freedraw",
			"version": 135,
			"versionNonce": 432000282,
			"isDeleted": false,
			"id": "kCKXzBARdjJPbDF8svKmu",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -308.1252294627178,
			"y": -74.21942884233948,
			"strokeColor": "#000",
			"backgroundColor": "#fa5252",
			"width": 7.272700883633092,
			"height": 32.29425511422801,
			"seed": 401510619,
			"groupIds": [
				"YFANPKnAsrun7h8qCEu0O"
			],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					-1.3877787807814457e-17,
					0.20923445002517838
				],
				[
					0.4220763905680087,
					0.6277033500754783
				],
				[
					0.6313108405931872,
					0.8369378001006569
				],
				[
					0.8405452906183656,
					0.8369378001006569
				],
				[
					1.0497797406435438,
					1.2590141906686654
				],
				[
					1.2590141906686085,
					1.468248640693787
				],
				[
					1.468248640693787,
					1.677483090718965
				],
				[
					1.6774830907189655,
					2.099559481286974
				],
				[
					1.8867175407441434,
					2.3087939313120955
				],
				[
					2.095951990769322,
					2.308793931312096
				],
				[
					2.0959519907693225,
					2.518028381337274
				],
				[
					2.305186440794501,
					2.9401047719052817
				],
				[
					2.514420890819565,
					3.1493392219304037
				],
				[
					2.7236553408447435,
					3.571415612498413
				],
				[
					2.9328897908699223,
					3.780650062523592
				],
				[
					3.73736017631154,
					4.318166149657146
				],
				[
					4.112539190149733,
					5.818882205010025
				],
				[
					4.534615580717741,
					6.028116655035205
				],
				[
					4.743850030742806,
					6.450193045603214
				],
				[
					4.953084480767984,
					7.081503886196344
				],
				[
					5.1623189307931625,
					7.503580276764353
				],
				[
					5.1623189307931625,
					7.712814726789475
				],
				[
					5.429273229101113,
					8.517285112231036
				],
				[
					5.429273229101113,
					9.321755497672598
				],
				[
					5.638507679126292,
					9.530989947697776
				],
				[
					5.638507679126292,
					11.031706003050658
				],
				[
					5.84774212915147,
					11.45378239361861
				],
				[
					5.84774212915147,
					11.663016843643788
				],
				[
					6.056976579176649,
					12.085093234211797
				],
				[
					6.056976579176649,
					12.294327684236919
				],
				[
					6.266211029201827,
					12.716404074804927
				],
				[
					6.266211029201827,
					14.21712013015781
				],
				[
					6.266211029201827,
					15.021590515599371
				],
				[
					6.641390043040019,
					16.522306570952196
				],
				[
					6.641390043040019,
					16.944382961520205
				],
				[
					6.641390043040019,
					17.788535742656222
				],
				[
					6.850624493065197,
					18.210612133224174
				],
				[
					6.850624493065197,
					18.419846583249353
				],
				[
					6.850624493065197,
					18.84192297381736
				],
				[
					6.850624493065197,
					19.051157423842483
				],
				[
					6.850624493065197,
					19.47323381441049
				],
				[
					6.850624493065197,
					19.68246826443567
				],
				[
					7.272700883633092,
					20.10454465500368
				],
				[
					7.272700883633092,
					20.3137791050288
				],
				[
					7.272700883633092,
					20.52301355505398
				],
				[
					7.272700883633092,
					20.7322480050791
				],
				[
					7.272700883633092,
					21.15432439564711
				],
				[
					7.272700883633092,
					21.363558845672287
				],
				[
					7.272700883633092,
					21.572793295697466
				],
				[
					7.272700883633092,
					21.782027745722587
				],
				[
					7.272700883633092,
					21.991262195747765
				],
				[
					7.272700883633092,
					22.413338586315774
				],
				[
					7.272700883633092,
					23.427043421782457
				],
				[
					7.059858943090262,
					23.849119812350466
				],
				[
					6.6197450999339935,
					26.04608153761461
				],
				[
					6.4069031593910495,
					26.46815792818262
				],
				[
					6.4069031593910495,
					27.272628313624182
				],
				[
					6.136341370565447,
					28.077098699065743
				],
				[
					6.136341370565447,
					28.881569084507305
				],
				[
					5.923499430022616,
					29.303645475075314
				],
				[
					5.710657489479786,
					29.512879925100435
				],
				[
					4.9025796135205155,
					29.779834223408443
				],
				[
					4.689737672977685,
					29.989068673433565
				],
				[
					4.476895732434855,
					29.989068673433565
				],
				[
					4.2640537918920245,
					30.198303123458743
				],
				[
					3.6255279702635335,
					30.40753757348392
				],
				[
					3.412686029720703,
					30.616772023509043
				],
				[
					3.1998440891778728,
					30.82600647353422
				],
				[
					2.9870021486350424,
					31.24808286410223
				],
				[
					2.5613182675493817,
					31.45731731412735
				],
				[
					2.3484763270065514,
					31.66655176415253
				],
				[
					1.9227924459208907,
					31.875786214177708
				],
				[
					1.7099505053780604,
					32.08502066420283
				],
				[
					1.49710856483523,
					32.29425511422801
				],
				[
					1.49710856483523,
					32.29425511422801
				]
			],
			"lastCommittedPoint": null,
			"simulatePressure": true,
			"pressures": []
		},
		{
			"type": "freedraw",
			"version": 93,
			"versionNonce": 1019390342,
			"isDeleted": false,
			"id": "PanqaUAZpLlPeHIAUIj-O",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -336.0363835979705,
			"y": -92.88819227130841,
			"strokeColor": "#000",
			"backgroundColor": "#fa5252",
			"width": 16.756793454601166,
			"height": 16.933560489967192,
			"seed": 1568122517,
			"groupIds": [
				"YFANPKnAsrun7h8qCEu0O"
			],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					-0.21284194054283037,
					0.20923445002517835
				],
				[
					-0.003607490517651968,
					0.6313108405931871
				],
				[
					0.41846890005035675,
					0.6313108405931871
				],
				[
					4.372278507422266,
					3.264778918496006
				],
				[
					6.569240232686525,
					4.141399114291119
				],
				[
					9.458840137344282,
					5.104599082510333
				],
				[
					13.15651791796131,
					6.73157730598183
				],
				[
					14.657233973314192,
					7.481935333658271
				],
				[
					14.86646842333937,
					7.9040117242262795
				],
				[
					15.075702873364548,
					8.113246174251458
				],
				[
					15.284937323389613,
					8.113246174251458
				],
				[
					15.494171773414791,
					8.113246174251458
				],
				[
					15.9162481639828,
					8.32248062427658
				],
				[
					16.12548261400798,
					8.32248062427658
				],
				[
					16.334717064033157,
					8.744557014844588
				],
				[
					16.543951514058335,
					8.953791464869767
				],
				[
					16.331109573515505,
					9.163025914894888
				],
				[
					16.331109573515505,
					9.372260364920066
				],
				[
					15.90542569242973,
					9.794336755488075
				],
				[
					15.364302114778525,
					10.598807140929637
				],
				[
					14.938618233692864,
					11.020883531497589
				],
				[
					14.512934352607203,
					11.230117981522767
				],
				[
					13.704856476647933,
					11.230117981522767
				],
				[
					12.200532930777399,
					11.980476009199208
				],
				[
					11.65940935312608,
					12.78494639464077
				],
				[
					9.347007931296389,
					13.697641495612572
				],
				[
					7.842684385425855,
					14.447999523289013
				],
				[
					7.417000504340194,
					14.657233973314192
				],
				[
					5.656545131714665,
					15.97396801226563
				],
				[
					5.230861250629005,
					15.97396801226563
				],
				[
					3.5136957642156403,
					16.724326039942014
				],
				[
					3.0880118831299797,
					16.933560489967192
				],
				[
					3.0880118831299797,
					16.933560489967192
				]
			],
			"lastCommittedPoint": null,
			"simulatePressure": true,
			"pressures": []
		},
		{
			"type": "freedraw",
			"version": 100,
			"versionNonce": 1698372058,
			"isDeleted": false,
			"id": "DhWAZsKYCG3QVSaxvg5ZF",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -313.6374749737254,
			"y": -52.000894743978165,
			"strokeColor": "#000",
			"backgroundColor": "#fa5252",
			"width": 19.332541684221155,
			"height": 11.818138935903846,
			"seed": 702448283,
			"groupIds": [
				"YFANPKnAsrun7h8qCEu0O"
			],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					0.2092344500250647,
					-0.2128419405428872
				],
				[
					0.4184689000502431,
					-0.2128419405428872
				],
				[
					0.6277033500754214,
					-0.21284194054288724
				],
				[
					0.8369378001005998,
					0.20923445002512153
				],
				[
					0.8369378001005997,
					0.6313108405931301
				],
				[
					0.8369378001005995,
					2.1320268959460122
				],
				[
					0.8369378001006003,
					3.6327429512988374
				],
				[
					0.8369378001005994,
					4.054819341866846
				],
				[
					0.8369378001005994,
					4.859289727308408
				],
				[
					1.1038920984085507,
					5.663760112749969
				],
				[
					1.1038920984085498,
					7.860721838014116
				],
				[
					1.1038920984085507,
					8.665192223455676
				],
				[
					1.3131265484337291,
					9.087268614023685
				],
				[
					1.3131265484337291,
					9.509345004591694
				],
				[
					1.3131265484337291,
					9.718579454616815
				],
				[
					1.5223609984589075,
					9.927813904641994
				],
				[
					1.7315954484839722,
					9.927813904641994
				],
				[
					1.9408298985091506,
					10.137048354667172
				],
				[
					2.3629062890771593,
					10.346282804692294
				],
				[
					2.5721407391023376,
					10.346282804692294
				],
				[
					2.781375189127516,
					10.768359195260302
				],
				[
					2.9906096391526944,
					10.97759364528548
				],
				[
					3.1998440891778728,
					11.186828095310602
				],
				[
					3.621920479745768,
					11.39606254533578
				],
				[
					3.831154929770946,
					11.605296995360959
				],
				[
					4.040389379796125,
					11.605296995360959
				],
				[
					4.249623829821303,
					11.605296995360959
				],
				[
					4.671700220389312,
					11.605296995360959
				],
				[
					6.172416275742194,
					11.605296995360959
				],
				[
					6.976886661183698,
					11.605296995360959
				],
				[
					10.573554707305789,
					11.605296995360959
				],
				[
					12.07427076265867,
					11.605296995360959
				],
				[
					14.963870667316542,
					11.605296995360959
				],
				[
					15.768341052758046,
					11.605296995360959
				],
				[
					16.572811438199665,
					11.605296995360959
				],
				[
					18.28276194357761,
					11.226510491005058
				],
				[
					18.49199639360279,
					11.226510491005058
				],
				[
					18.701230843627968,
					11.226510491005058
				],
				[
					19.123307234195977,
					11.226510491005058
				],
				[
					19.332541684221155,
					11.435744941030237
				],
				[
					19.332541684221155,
					11.435744941030237
				]
			],
			"lastCommittedPoint": null,
			"simulatePressure": true,
			"pressures": []
		},
		{
			"type": "freedraw",
			"version": 152,
			"versionNonce": 1929349318,
			"isDeleted": false,
			"id": "rJla8Pr4RZIQUL2BaYuiS",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -348.32710379168975,
			"y": -35.58320539803856,
			"strokeColor": "#000",
			"backgroundColor": "#fa5252",
			"width": 36.3382519845419,
			"height": 8.575004960513866,
			"seed": 1092338037,
			"groupIds": [
				"YFANPKnAsrun7h8qCEu0O"
			],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					-1.3877787807814457e-17,
					0.20923445002517838
				],
				[
					0.4220763905680086,
					0.6313108405931303
				],
				[
					2.6010006632437808,
					2.810235113268959
				],
				[
					3.023077053811791,
					2.810235113268959
				],
				[
					3.2323115038369683,
					2.8102351132689596
				],
				[
					4.036781889278586,
					3.0771894115769105
				],
				[
					4.246016339303651,
					3.499265802144919
				],
				[
					4.455250789328829,
					3.499265802144919
				],
				[
					4.664485239354008,
					3.9213421927128707
				],
				[
					5.086561629922016,
					4.130576642738049
				],
				[
					5.508638020490025,
					4.130576642738049
				],
				[
					5.930714411058034,
					4.339811092763227
				],
				[
					6.139948861083099,
					4.339811092763227
				],
				[
					6.562025251651107,
					4.549045542788349
				],
				[
					6.771259701676286,
					4.758279992813527
				],
				[
					8.271975757029168,
					5.508638020489968
				],
				[
					8.481210207054346,
					5.508638020489968
				],
				[
					8.903286597622355,
					5.930714411057977
				],
				[
					9.112521047647533,
					5.930714411057977
				],
				[
					9.321755497672598,
					6.139948861083099
				],
				[
					9.530989947697776,
					6.139948861083099
				],
				[
					11.031706003050658,
					6.139948861083099
				],
				[
					11.240940453075837,
					6.139948861083099
				],
				[
					11.663016843643845,
					6.139948861083099
				],
				[
					11.872251293669024,
					6.139948861083099
				],
				[
					13.372967349021792,
					6.5151278749213475
				],
				[
					13.7950437395898,
					6.724362324946469
				],
				[
					14.21712013015781,
					6.724362324946469
				],
				[
					14.426354580182988,
					6.724362324946469
				],
				[
					14.848430970750996,
					6.933596774971647
				],
				[
					15.26689987080124,
					6.933596774971647
				],
				[
					15.688976261369248,
					6.933596774971647
				],
				[
					15.898210711394427,
					6.933596774971647
				],
				[
					16.320287101962435,
					7.142831224996826
				],
				[
					16.529521551987614,
					7.142831224996826
				],
				[
					16.951597942555622,
					7.142831224996826
				],
				[
					17.1608323925808,
					7.142831224996826
				],
				[
					17.370066842605866,
					7.142831224996826
				],
				[
					17.579301292631044,
					7.142831224996826
				],
				[
					17.788535742656222,
					7.142831224996826
				],
				[
					17.9977701926814,
					7.142831224996826
				],
				[
					18.20700464270658,
					7.142831224996826
				],
				[
					18.629081033274588,
					7.142831224996826
				],
				[
					19.051157423842483,
					7.142831224996826
				],
				[
					19.47323381441049,
					7.352065675021947
				],
				[
					20.27770419985211,
					7.352065675021947
				],
				[
					20.48693864987729,
					7.352065675021947
				],
				[
					21.291409035318793,
					7.889581762155558
				],
				[
					21.50064348534397,
					7.889581762155558
				],
				[
					22.305113870785476,
					7.889581762155558
				],
				[
					22.727190261353485,
					7.889581762155558
				],
				[
					23.149266651921494,
					7.889581762155558
				],
				[
					23.953737037363112,
					8.156536060463509
				],
				[
					24.585047877956185,
					8.365770510488687
				],
				[
					25.007124268524194,
					8.365770510488687
				],
				[
					25.429200659092203,
					8.575004960513866
				],
				[
					25.63843510911738,
					8.575004960513866
				],
				[
					25.84766955914256,
					8.575004960513866
				],
				[
					26.056904009167738,
					8.575004960513866
				],
				[
					27.557620064520506,
					8.575004960513866
				],
				[
					27.979696455088515,
					8.575004960513866
				],
				[
					28.188930905113693,
					8.575004960513866
				],
				[
					28.39816535513887,
					8.575004960513866
				],
				[
					28.82024174570688,
					8.575004960513866
				],
				[
					29.02947619573206,
					8.575004960513866
				],
				[
					29.451552586299954,
					8.575004960513866
				],
				[
					29.660787036325132,
					8.575004960513866
				],
				[
					29.87002148635031,
					8.575004960513866
				],
				[
					30.29209787691832,
					8.575004960513866
				],
				[
					30.714174267486328,
					8.575004960513866
				],
				[
					30.923408717511506,
					8.575004960513866
				],
				[
					31.13264316753657,
					8.575004960513866
				],
				[
					31.34187761756175,
					8.575004960513866
				],
				[
					31.551112067586928,
					8.575004960513866
				],
				[
					31.760346517612106,
					8.575004960513866
				],
				[
					32.17881541766246,
					8.575004960513866
				],
				[
					32.38804986768753,
					8.575004960513866
				],
				[
					32.597284317712706,
					8.575004960513866
				],
				[
					33.019360708280715,
					8.575004960513866
				],
				[
					33.82383109372233,
					8.575004960513866
				],
				[
					34.0330655437474,
					8.575004960513866
				],
				[
					34.242299993772576,
					8.362163019971035
				],
				[
					34.451534443797755,
					8.362163019971035
				],
				[
					34.66076889382293,
					8.362163019971035
				],
				[
					34.87000334384811,
					8.149321079428148
				],
				[
					35.29207973441612,
					7.936479138885318
				],
				[
					35.501314184441185,
					7.723637198342487
				],
				[
					35.501314184441185,
					7.510795257799657
				],
				[
					35.71054863446636,
					7.297953317256827
				],
				[
					35.91978308449154,
					7.085111376713996
				],
				[
					36.12901753451672,
					7.085111376713996
				],
				[
					36.3382519845419,
					6.872269436171166
				],
				[
					36.3382519845419,
					6.872269436171166
				]
			],
			"lastCommittedPoint": null,
			"simulatePressure": true,
			"pressures": []
		},
		{
			"type": "freedraw",
			"version": 83,
			"versionNonce": 1697566362,
			"isDeleted": false,
			"id": "lWva3ZxvwsMLVUO8HiuWO",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -349.0954992719545,
			"y": -32.873980019264536,
			"strokeColor": "#000",
			"backgroundColor": "#fa5252",
			"width": 3.0230770538117895,
			"height": 12.388122437696495,
			"seed": 2021206459,
			"groupIds": [
				"YFANPKnAsrun7h8qCEu0O"
			],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					-1.3877787807814457e-17,
					0.20923445002517838
				],
				[
					0,
					1.01370483546674
				],
				[
					0.26695429830795103,
					1.8181752209083015
				],
				[
					0.7034606509466814,
					4.437213336740456
				],
				[
					1.3455939630928242,
					6.7423997775349
				],
				[
					1.3455939630928242,
					7.164476168102851
				],
				[
					1.3455939630928246,
					7.586552558670861
				],
				[
					1.3455939630928242,
					8.391022944112422
				],
				[
					1.5548284131180026,
					8.81309933468043
				],
				[
					1.5548284131180026,
					9.022333784705552
				],
				[
					1.5548284131180026,
					9.23156823473073
				],
				[
					1.764062863143181,
					9.440802684755909
				],
				[
					1.764062863143181,
					9.862879075323917
				],
				[
					2.1861392537111897,
					10.072113525349039
				],
				[
					2.1861392537111897,
					10.494189915917048
				],
				[
					2.3953737037362544,
					10.703424365942226
				],
				[
					2.3953737037362544,
					11.125500756510178
				],
				[
					2.6046081537614327,
					11.547577147078186
				],
				[
					2.813842603786611,
					11.969653537646195
				],
				[
					2.813842603786611,
					12.178887987671317
				],
				[
					3.0230770538117895,
					12.388122437696495
				],
				[
					2.810235113268959,
					12.388122437696495
				],
				[
					2.597393172726129,
					11.962438556610834
				],
				[
					2.597393172726129,
					11.962438556610834
				]
			],
			"lastCommittedPoint": null,
			"simulatePressure": true,
			"pressures": []
		},
		{
			"type": "freedraw",
			"version": 71,
			"versionNonce": 1692303366,
			"isDeleted": false,
			"id": "sfb91UItgBsUHC9PUd9LG",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -348.8970872934824,
			"y": -38.16256111817631,
			"strokeColor": "#000",
			"backgroundColor": "#fa5252",
			"width": 18.751735710875437,
			"height": 1.7857078062492064,
			"seed": 929688027,
			"groupIds": [
				"YFANPKnAsrun7h8qCEu0O"
			],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"points": [
				[
					0,
					0
				],
				[
					1.3877787807814457e-17,
					-0.21284194054283034
				],
				[
					0.42207639056800883,
					-0.2128419405428303
				],
				[
					0.8441527811360174,
					-0.2128419405428304
				],
				[
					4.440820827258108,
					-0.2128419405428308
				],
				[
					6.637782552522253,
					-0.21284194054283034
				],
				[
					10.937911249591139,
					-0.21284194054283034
				],
				[
					13.134872974855284,
					-0.6529557836992126
				],
				[
					16.02447287951304,
					-1.1363595130676458
				],
				[
					17.525188934865923,
					-1.5151460174235467
				],
				[
					18.329659320307428,
					-1.7857078062492064
				],
				[
					18.751735710875437,
					-1.7857078062492064
				],
				[
					18.751735710875437,
					-1.7857078062492064
				]
			],
			"lastCommittedPoint": null,
			"simulatePressure": true,
			"pressures": []
		},
		{
			"type": "rectangle",
			"version": 325,
			"versionNonce": 1045293914,
			"isDeleted": false,
			"id": "j1W3wXsh4D9k1fsLAo8rF",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -272.0980678622676,
			"y": -85.89479513300753,
			"strokeColor": "#000",
			"backgroundColor": "#fab005",
			"width": 204,
			"height": 64.4261731551606,
			"seed": 176737877,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [
				{
					"id": "QwGCYinl",
					"type": "text"
				},
				{
					"id": "VET4DUt24fQtfqueyWehZ",
					"type": "arrow"
				},
				{
					"id": "Kj6VVFAOm1YqZlmQDN4ZH",
					"type": "arrow"
				}
			],
			"updated": 1662104620555,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 320,
			"versionNonce": 106729286,
			"isDeleted": false,
			"id": "QwGCYinl",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -267.0980678622676,
			"y": -63.681708555427235,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 194,
			"height": 20,
			"seed": 1509010811,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 1,
			"text": "后台线程",
			"rawText": "后台线程",
			"baseline": 14,
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "j1W3wXsh4D9k1fsLAo8rF",
			"originalText": "后台线程"
		},
		{
			"type": "arrow",
			"version": 185,
			"versionNonce": 116092954,
			"isDeleted": false,
			"id": "DAX-q0n8Le8TC9FHTQGbe",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -270.249271130695,
			"y": -54.21235429503872,
			"strokeColor": "#000",
			"backgroundColor": "#fab005",
			"width": 103.50553806722382,
			"height": 0.4228551260122231,
			"seed": 98177141,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"startBinding": null,
			"endBinding": {
				"elementId": "LspK9rlr1ksCxdxN3XUVp",
				"gap": 3.2301805501947456,
				"focus": -0.11908598036635432
			},
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": "arrow",
			"points": [
				[
					0,
					0
				],
				[
					-103.50553806722382,
					0.4228551260122231
				]
			]
		},
		{
			"type": "text",
			"version": 554,
			"versionNonce": 1138144902,
			"isDeleted": false,
			"id": "bsoQrJVI",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -306.1032094696112,
			"y": 6.262126936487306,
			"strokeColor": "#000",
			"backgroundColor": "#fab005",
			"width": 321,
			"height": 47,
			"seed": 1387999067,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"fontSize": 16.63163771019658,
			"fontFamily": 1,
			"text": "每隔 1s ，会把 redo log buffer 中的内容\n写到 page cache, 后调用 fsync 刷盘",
			"rawText": "每隔 1s ，会把 redo log buffer 中的内容\n写到 page cache, 后调用 fsync 刷盘",
			"baseline": 41,
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "每隔 1s ，会把 redo log buffer 中的内容\n写到 page cache, 后调用 fsync 刷盘"
		},
		{
			"type": "rectangle",
			"version": 719,
			"versionNonce": 318397658,
			"isDeleted": false,
			"id": "isMLHxCUpWXOHMI1h7cts",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -670.6884102713035,
			"y": 318.11158754800283,
			"strokeColor": "#000",
			"backgroundColor": "#fab005",
			"width": 113,
			"height": 53,
			"seed": 344440699,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [
				{
					"id": "VET4DUt24fQtfqueyWehZ",
					"type": "arrow"
				},
				{
					"id": "Kj6VVFAOm1YqZlmQDN4ZH",
					"type": "arrow"
				},
				{
					"type": "text",
					"id": "aBUv1Egi"
				},
				{
					"id": "469dz5WLht4eqS5oBgvkc",
					"type": "arrow"
				}
			],
			"updated": 1662104620555,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 365,
			"versionNonce": 1980364230,
			"isDeleted": false,
			"id": "aBUv1Egi",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -665.6884102713035,
			"y": 334.61158754800283,
			"strokeColor": "#000",
			"backgroundColor": "#fab005",
			"width": 103,
			"height": 20,
			"seed": 2016682773,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 1,
			"text": "redolog file",
			"rawText": "redolog file",
			"baseline": 14,
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "isMLHxCUpWXOHMI1h7cts",
			"originalText": "redolog file"
		},
		{
			"type": "arrow",
			"version": 1349,
			"versionNonce": 1074639258,
			"isDeleted": false,
			"id": "469dz5WLht4eqS5oBgvkc",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -511.742066964503,
			"y": 202.7459071162649,
			"strokeColor": "#000",
			"backgroundColor": "#fab005",
			"width": 101.84137822090736,
			"height": 114.36568043173793,
			"seed": 901731573,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"startBinding": {
				"elementId": "bmhffoFi0BzShyRkFSRiG",
				"gap": 2.457862022013444,
				"focus": 0.011942095719562397
			},
			"endBinding": {
				"elementId": "isMLHxCUpWXOHMI1h7cts",
				"gap": 1,
				"focus": -0.2981784116301534
			},
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": "arrow",
			"points": [
				[
					0,
					0
				],
				[
					-101.84137822090736,
					114.36568043173793
				]
			]
		},
		{
			"type": "text",
			"version": 90,
			"versionNonce": 1444105478,
			"isDeleted": false,
			"id": "Andxkyz4",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -456.2968453818353,
			"y": 204.12022714169962,
			"strokeColor": "#000",
			"backgroundColor": "#fab005",
			"width": 33,
			"height": 23,
			"seed": 1693061275,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 1,
			"text": "刷盘",
			"rawText": "刷盘",
			"baseline": 17,
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "刷盘"
		},
		{
			"type": "ellipse",
			"version": 827,
			"versionNonce": 1096314458,
			"isDeleted": false,
			"id": "WjvRyDbMCu3CkXPltynRa",
			"fillStyle": "cross-hatch",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -892.0278456978637,
			"y": 337.25314023885903,
			"strokeColor": "#000",
			"backgroundColor": "#7950f2",
			"width": 199.08123741330417,
			"height": 59.54426626291195,
			"seed": 425762005,
			"groupIds": [
				"HNnhMNlGpGaPwJ3zj5khK"
			],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false
		},
		{
			"type": "ellipse",
			"version": 900,
			"versionNonce": 1903148102,
			"isDeleted": false,
			"id": "dgEQcac5nSDwrVedvBVzp",
			"fillStyle": "cross-hatch",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -890.6835840318371,
			"y": 318.4125951798682,
			"strokeColor": "#000",
			"backgroundColor": "#7950f2",
			"width": 199.08123741330417,
			"height": 59.54426626291195,
			"seed": 1894492917,
			"groupIds": [
				"HNnhMNlGpGaPwJ3zj5khK"
			],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false
		},
		{
			"type": "ellipse",
			"version": 916,
			"versionNonce": 1806537498,
			"isDeleted": false,
			"id": "Z3QZs_SKIAjn5NOHhPhhw",
			"fillStyle": "cross-hatch",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -891.6754664261869,
			"y": 297.54652186294214,
			"strokeColor": "#000",
			"backgroundColor": "#7950f2",
			"width": 199.08123741330417,
			"height": 59.54426626291195,
			"seed": 447321621,
			"groupIds": [
				"HNnhMNlGpGaPwJ3zj5khK"
			],
			"strokeSharpness": "round",
			"boundElements": [
				{
					"type": "text",
					"id": "wSc6xuiq"
				}
			],
			"updated": 1662104620555,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 712,
			"versionNonce": 503071622,
			"isDeleted": false,
			"id": "wSc6xuiq",
			"fillStyle": "cross-hatch",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -886.6754664261869,
			"y": 304.3186549943981,
			"strokeColor": "#000",
			"backgroundColor": "#7950f2",
			"width": 189.08123741330417,
			"height": 46,
			"seed": 57446869,
			"groupIds": [
				"HNnhMNlGpGaPwJ3zj5khK"
			],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"fontSize": 36.015473793010315,
			"fontFamily": 1,
			"text": "硬盘",
			"rawText": "硬盘",
			"baseline": 32,
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "Z3QZs_SKIAjn5NOHhPhhw",
			"originalText": "硬盘"
		},
		{
			"type": "rectangle",
			"version": 938,
			"versionNonce": 25173978,
			"isDeleted": false,
			"id": "KL6f8TsaVNo63beofM-bY",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -878.718370186462,
			"y": 28.77522094854723,
			"strokeColor": "#000",
			"backgroundColor": "#fa5252",
			"width": 162.7130106300392,
			"height": 187.24909953456893,
			"seed": 1345721851,
			"groupIds": [
				"PiGGAcg8XZnWu6uzdLVkT"
			],
			"strokeSharpness": "round",
			"boundElements": [
				{
					"id": "UPf5OHnRF3ONpV2mKGDvJ",
					"type": "arrow"
				}
			],
			"updated": 1662104620555,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 244,
			"versionNonce": 1844830918,
			"isDeleted": false,
			"id": "LzfwzY4d",
			"fillStyle": "cross-hatch",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -837.7599095884023,
			"y": 42.378591329244685,
			"strokeColor": "#000",
			"backgroundColor": "#fa5252",
			"width": 84,
			"height": 30,
			"seed": 2059325819,
			"groupIds": [
				"PiGGAcg8XZnWu6uzdLVkT"
			],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"fontSize": 20.661969603814494,
			"fontFamily": 1,
			"text": "提交事务",
			"rawText": "提交事务",
			"baseline": 22,
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "提交事务"
		},
		{
			"type": "rectangle",
			"version": 503,
			"versionNonce": 2128811162,
			"isDeleted": false,
			"id": "YY1BLPzsP8wvZxrRquJmC",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -846.6539300454573,
			"y": 74.84598823119754,
			"strokeColor": "#000",
			"backgroundColor": "#4c6ef5",
			"width": 97,
			"height": 40.87638427977213,
			"seed": 653161883,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [
				{
					"id": "jlmFX7vr",
					"type": "text"
				},
				{
					"id": "097UlXnPAcZXidAyKrMfr",
					"type": "arrow"
				},
				{
					"id": "RII4aeQtVhddoazXLOTga",
					"type": "arrow"
				}
			],
			"updated": 1662104620555,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 596,
			"versionNonce": 603560454,
			"isDeleted": false,
			"id": "jlmFX7vr",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -841.6539300454573,
			"y": 85.28418037108361,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 87,
			"height": 20,
			"seed": 1569818005,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"fontSize": 15.52386107521644,
			"fontFamily": 1,
			"text": "写入 bin log",
			"rawText": "写入 bin log",
			"baseline": 14,
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "YY1BLPzsP8wvZxrRquJmC",
			"originalText": "写入 bin log"
		},
		{
			"type": "rectangle",
			"version": 651,
			"versionNonce": 1703506266,
			"isDeleted": false,
			"id": "B4VlYsMeBEmpQya4ppGn5",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -861.8069950703193,
			"y": 147.67648813494108,
			"strokeColor": "#000",
			"backgroundColor": "#4c6ef5",
			"width": 131,
			"height": 50,
			"seed": 2095259925,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [
				{
					"id": "YINOSuw9",
					"type": "text"
				},
				{
					"id": "097UlXnPAcZXidAyKrMfr",
					"type": "arrow"
				},
				{
					"id": "RII4aeQtVhddoazXLOTga",
					"type": "arrow"
				},
				{
					"id": "sgi_DaVzFCHvR6nhEViVs",
					"type": "arrow"
				}
			],
			"updated": 1662104620555,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 764,
			"versionNonce": 654600518,
			"isDeleted": false,
			"id": "YINOSuw9",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -856.8069950703193,
			"y": 152.67648813494108,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 121,
			"height": 40,
			"seed": 254469819,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"fontSize": 15.52386107521644,
			"fontFamily": 1,
			"text": "写入 redo log\n（commit）",
			"rawText": "写入 redo log\n（commit）",
			"baseline": 34,
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "B4VlYsMeBEmpQya4ppGn5",
			"originalText": "写入 redo log\n（commit）"
		},
		{
			"type": "arrow",
			"version": 241,
			"versionNonce": 147207706,
			"isDeleted": false,
			"id": "RII4aeQtVhddoazXLOTga",
			"fillStyle": "cross-hatch",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -797.9554998985843,
			"y": 116.9933179522219,
			"strokeColor": "#000",
			"backgroundColor": "#4c6ef5",
			"width": 0.12560874155906276,
			"height": 26.85254805858449,
			"seed": 897146037,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"startBinding": {
				"elementId": "YY1BLPzsP8wvZxrRquJmC",
				"gap": 1.2709454412522234,
				"focus": -0.001993613388988296
			},
			"endBinding": {
				"elementId": "B4VlYsMeBEmpQya4ppGn5",
				"gap": 3.830622124134692,
				"focus": -0.021153598465449366
			},
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": "arrow",
			"points": [
				[
					0,
					0
				],
				[
					0.12560874155906276,
					26.85254805858449
				]
			]
		},
		{
			"type": "text",
			"version": 270,
			"versionNonce": 1987268742,
			"isDeleted": false,
			"id": "7yjHwSnc",
			"fillStyle": "cross-hatch",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -676.5284974547524,
			"y": 145.06229612302099,
			"strokeColor": "#000",
			"backgroundColor": "#4c6ef5",
			"width": 65,
			"height": 23,
			"seed": 1079891771,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 1,
			"text": "主动刷盘",
			"rawText": "主动刷盘",
			"baseline": 17,
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "主动刷盘"
		},
		{
			"type": "arrow",
			"version": 193,
			"versionNonce": 1502372570,
			"isDeleted": false,
			"id": "sgi_DaVzFCHvR6nhEViVs",
			"fillStyle": "cross-hatch",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -729.8069950703193,
			"y": 173.07559896140893,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 143.60520216102157,
			"height": 3.233856252521093,
			"seed": 493028021,
			"groupIds": [],
			"strokeSharpness": "sharp",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"startBinding": {
				"elementId": "B4VlYsMeBEmpQya4ppGn5",
				"gap": 1,
				"focus": -0.04148848560486516
			},
			"endBinding": {
				"elementId": "bmhffoFi0BzShyRkFSRiG",
				"gap": 4.894481170784502,
				"focus": -0.30836428755934736
			},
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": "arrow",
			"points": [
				[
					0,
					0
				],
				[
					143.60520216102157,
					3.233856252521093
				]
			]
		},
		{
			"type": "rectangle",
			"version": 439,
			"versionNonce": 503533510,
			"isDeleted": false,
			"id": "TN1JYO0MoplhR5TRAemRw",
			"fillStyle": "cross-hatch",
			"strokeWidth": 1,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -680.4382322806649,
			"y": -221.1709892039442,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 686.9708806818181,
			"height": 579.8473011363635,
			"seed": 719818779,
			"groupIds": [
				"frlRWrT3llsMay8Rt1CIV",
				"UGUEM2e5C9m7ubtetIN2i"
			],
			"strokeSharpness": "round",
			"boundElements": [
				{
					"id": "zhyxxFLyBVT5SGBZuepEk",
					"type": "arrow"
				}
			],
			"updated": 1662104620555,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 131,
			"versionNonce": 846133146,
			"isDeleted": false,
			"id": "dMeiMwTF",
			"fillStyle": "cross-hatch",
			"strokeWidth": 1,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -429.42615841702855,
			"y": -202.9216994312168,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 182,
			"height": 29,
			"seed": 51097717,
			"groupIds": [
				"frlRWrT3llsMay8Rt1CIV",
				"UGUEM2e5C9m7ubtetIN2i"
			],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"fontSize": 20,
			"fontFamily": 1,
			"text": "InnoDB 存储引擎层",
			"rawText": "InnoDB 存储引擎层",
			"baseline": 21,
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "InnoDB 存储引擎层"
		},
		{
			"type": "line",
			"version": 242,
			"versionNonce": 701589254,
			"isDeleted": false,
			"id": "vUqxEINtj5SMiaGGb7e6a",
			"fillStyle": "cross-hatch",
			"strokeWidth": 1,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -679.5788572806649,
			"y": 79.22673806878316,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 686.9815340909091,
			"height": 2.748579545454561,
			"seed": 1168816405,
			"groupIds": [
				"UGUEM2e5C9m7ubtetIN2i"
			],
			"strokeSharpness": "sharp",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"startBinding": null,
			"endBinding": null,
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": null,
			"points": [
				[
					0,
					0
				],
				[
					686.9815340909091,
					2.748579545454561
				]
			]
		},
		{
			"type": "line",
			"version": 162,
			"versionNonce": 597750874,
			"isDeleted": false,
			"id": "0tQZeqWFuQqGPX-TuSJrF",
			"fillStyle": "cross-hatch",
			"strokeWidth": 1,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -665.9049721716244,
			"y": -145.78119027040572,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 659.7257008046631,
			"height": 4.517672028818936,
			"seed": 246336187,
			"groupIds": [
				"UGUEM2e5C9m7ubtetIN2i"
			],
			"strokeSharpness": "sharp",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"startBinding": null,
			"endBinding": null,
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": null,
			"points": [
				[
					0,
					0
				],
				[
					659.7257008046631,
					-4.517672028818936
				]
			]
		},
		{
			"type": "text",
			"version": 24,
			"versionNonce": 442144326,
			"isDeleted": false,
			"id": "GanLseQZ",
			"fillStyle": "cross-hatch",
			"strokeWidth": 1,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -139.22084552481783,
			"y": -137.36563284208876,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 77,
			"height": 25,
			"seed": 398683835,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"fontSize": 20,
			"fontFamily": 1,
			"text": "Prepare",
			"rawText": "Prepare",
			"baseline": 18,
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "Prepare"
		},
		{
			"type": "text",
			"version": 9,
			"versionNonce": 1056266522,
			"isDeleted": false,
			"id": "Xb33O91b",
			"fillStyle": "cross-hatch",
			"strokeWidth": 1,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -134.4484004510706,
			"y": 96.72530026047752,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 66,
			"height": 25,
			"seed": 1481275285,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"fontSize": 20,
			"fontFamily": 1,
			"text": "Commit",
			"rawText": "Commit",
			"baseline": 18,
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "Commit"
		},
		{
			"type": "arrow",
			"version": 318,
			"versionNonce": 1484512646,
			"isDeleted": false,
			"id": "4JWrZFWoAu73hZUevlkt1",
			"fillStyle": "cross-hatch",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -845.469924140863,
			"y": 96.0848702211349,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 117.50713254443212,
			"height": 0.2891523204254298,
			"seed": 494156565,
			"groupIds": [],
			"strokeSharpness": "sharp",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"startBinding": null,
			"endBinding": {
				"elementId": "bk991peUO7RF-YRr-zin0",
				"gap": 5.087120624232057,
				"focus": 0.12909709137920078
			},
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": "arrow",
			"points": [
				[
					0,
					0
				],
				[
					-117.50713254443212,
					0.2891523204254298
				]
			]
		},
		{
			"type": "arrow",
			"version": 237,
			"versionNonce": 1675568602,
			"isDeleted": false,
			"id": "zhyxxFLyBVT5SGBZuepEk",
			"fillStyle": "cross-hatch",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 11.82317396842268,
			"y": -51.49241605361624,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 105.85820016773266,
			"height": 200.13332582854378,
			"seed": 129031739,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"startBinding": {
				"elementId": "TN1JYO0MoplhR5TRAemRw",
				"focus": -0.47077535418647326,
				"gap": 5.290525567269469
			},
			"endBinding": {
				"elementId": "TN1JYO0MoplhR5TRAemRw",
				"focus": 0.36494914004755724,
				"gap": 1.6054154531270797
			},
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": "arrow",
			"points": [
				[
					0,
					0
				],
				[
					55.695207428802746,
					4.836138334979353
				],
				[
					89.69376037076006,
					47.56521758439243
				],
				[
					95.31241591516243,
					89.09777342637415
				],
				[
					102.17309005359027,
					137.53194907471868
				],
				[
					87.89215098162401,
					169.91542289257677
				],
				[
					36.1959704544646,
					195.42912353468796
				],
				[
					-3.6851101141423896,
					200.13332582854378
				]
			]
		},
		{
			"type": "text",
			"version": 91,
			"versionNonce": 695352518,
			"isDeleted": false,
			"id": "g3gSjRgg",
			"fillStyle": "cross-hatch",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": 74.32901083039962,
			"y": -9.141998944573913,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 21,
			"height": 114,
			"seed": 950576283,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"fontSize": 20,
			"fontFamily": 1,
			"text": "阶\n段\n更\n新",
			"rawText": "阶\n段\n更\n新",
			"baseline": 107,
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "阶\n段\n更\n新"
		},
		{
			"type": "rectangle",
			"version": 255,
			"versionNonce": 191978138,
			"isDeleted": false,
			"id": "lD1gMI8Vrbx63giWj1MHy",
			"fillStyle": "cross-hatch",
			"strokeWidth": 1,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -1219.6038666100073,
			"y": -24.46234376883399,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 291.1509961291995,
			"height": 287.24295960074494,
			"seed": 1159152571,
			"groupIds": [
				"wI_lfUuPn1jxZTsPfiKEX"
			],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 200,
			"versionNonce": 584758278,
			"isDeleted": false,
			"id": "hFUOUvxO",
			"fillStyle": "cross-hatch",
			"strokeWidth": 1,
			"strokeStyle": "dashed",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -1113.4635962853897,
			"y": -7.411799924909417,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 93,
			"height": 29,
			"seed": 244034965,
			"groupIds": [
				"wI_lfUuPn1jxZTsPfiKEX"
			],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"fontSize": 20,
			"fontFamily": 1,
			"text": "Server 层",
			"rawText": "Server 层",
			"baseline": 21,
			"textAlign": "left",
			"verticalAlign": "top",
			"containerId": null,
			"originalText": "Server 层"
		},
		{
			"type": "rectangle",
			"version": 690,
			"versionNonce": 341768026,
			"isDeleted": false,
			"id": "bk991peUO7RF-YRr-zin0",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -1172.0641773095272,
			"y": 60.233429214131235,
			"strokeColor": "#000",
			"backgroundColor": "#fa5252",
			"width": 204,
			"height": 64.4261731551606,
			"seed": 853179419,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [
				{
					"id": "0y2ZGghT",
					"type": "text"
				},
				{
					"id": "VET4DUt24fQtfqueyWehZ",
					"type": "arrow"
				},
				{
					"id": "469dz5WLht4eqS5oBgvkc",
					"type": "arrow"
				},
				{
					"id": "sgi_DaVzFCHvR6nhEViVs",
					"type": "arrow"
				},
				{
					"id": "4JWrZFWoAu73hZUevlkt1",
					"type": "arrow"
				},
				{
					"id": "QNa-ZxJdUWFAqbAoGI-w0",
					"type": "arrow"
				}
			],
			"updated": 1662104620555,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 723,
			"versionNonce": 514999110,
			"isDeleted": false,
			"id": "0y2ZGghT",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -1167.0641773095272,
			"y": 72.44651579171153,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 194,
			"height": 40,
			"seed": 1529816853,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 1,
			"text": "文件系统缓存\n(page cache)",
			"rawText": "文件系统缓存\n(page cache)",
			"baseline": 34,
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "bk991peUO7RF-YRr-zin0",
			"originalText": "文件系统缓存\n(page cache)"
		},
		{
			"type": "rectangle",
			"version": 771,
			"versionNonce": 251329562,
			"isDeleted": false,
			"id": "ZME1npmLQquyArr8W5P_S",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -1034.693031992559,
			"y": 311.5464706045236,
			"strokeColor": "#000",
			"backgroundColor": "#fab005",
			"width": 113,
			"height": 53,
			"seed": 1550635349,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [
				{
					"id": "VET4DUt24fQtfqueyWehZ",
					"type": "arrow"
				},
				{
					"id": "Kj6VVFAOm1YqZlmQDN4ZH",
					"type": "arrow"
				},
				{
					"id": "bpL8BHuO",
					"type": "text"
				},
				{
					"id": "469dz5WLht4eqS5oBgvkc",
					"type": "arrow"
				}
			],
			"updated": 1662104620555,
			"link": null,
			"locked": false
		},
		{
			"type": "text",
			"version": 423,
			"versionNonce": 794159750,
			"isDeleted": false,
			"id": "bpL8BHuO",
			"fillStyle": "hachure",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -1029.693031992559,
			"y": 328.0464706045236,
			"strokeColor": "#000",
			"backgroundColor": "#fab005",
			"width": 103,
			"height": 20,
			"seed": 176380539,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"fontSize": 16,
			"fontFamily": 1,
			"text": "binlog file",
			"rawText": "binlog file",
			"baseline": 14,
			"textAlign": "center",
			"verticalAlign": "middle",
			"containerId": "ZME1npmLQquyArr8W5P_S",
			"originalText": "binlog file"
		},
		{
			"type": "arrow",
			"version": 201,
			"versionNonce": 154691802,
			"isDeleted": false,
			"id": "QNa-ZxJdUWFAqbAoGI-w0",
			"fillStyle": "cross-hatch",
			"strokeWidth": 1,
			"strokeStyle": "solid",
			"roughness": 1,
			"opacity": 100,
			"angle": 0,
			"x": -1085.1168181404305,
			"y": 127.1320460512436,
			"strokeColor": "#000",
			"backgroundColor": "transparent",
			"width": 106.86464240529881,
			"height": 185.98306229957643,
			"seed": 1505227541,
			"groupIds": [],
			"strokeSharpness": "round",
			"boundElements": [],
			"updated": 1662104620555,
			"link": null,
			"locked": false,
			"startBinding": {
				"elementId": "bk991peUO7RF-YRr-zin0",
				"gap": 2.4724436819517734,
				"focus": 0.2902903017156425
			},
			"endBinding": null,
			"lastCommittedPoint": null,
			"startArrowhead": null,
			"endArrowhead": "arrow",
			"points": [
				[
					0,
					0
				],
				[
					106.86464240529881,
					185.98306229957643
				]
			]
		}
	],
	"appState": {
		"theme": "light",
		"viewBackgroundColor": "#fff",
		"currentItemStrokeColor": "#000",
		"currentItemBackgroundColor": "transparent",
		"currentItemFillStyle": "cross-hatch",
		"currentItemStrokeWidth": 1,
		"currentItemStrokeStyle": "solid",
		"currentItemRoughness": 1,
		"currentItemOpacity": 100,
		"currentItemFontFamily": 1,
		"currentItemFontSize": 20,
		"currentItemTextAlign": "left",
		"currentItemStrokeSharpness": "round",
		"currentItemStartArrowhead": null,
		"currentItemEndArrowhead": "arrow",
		"currentItemLinearStrokeSharpness": "round",
		"gridSize": null,
		"colorPalette": {}
	},
	"files": {}
}
```
%%