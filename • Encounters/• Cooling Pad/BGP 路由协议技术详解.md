---
title: BGP 路由协议技术详解
creation date: 2022-11-30 10:59:59
status: todo
tag: 
- Network/Router/BGP
---

## 一、BGP 的基本概念

### 自治系统  AS（Autonomous System）

AS 是指在一个实体管辖下的拥有相同选路策略的 IP 网络。BGP 网络中的每个 AS 都被分配一个唯一的 AS 号，用于区分不同的 AS。AS 号分为 2 字节 AS 号和 4 字节 AS 号，其中 2 字节 AS 号的范围为 1 至 65535， 4 字节 AS 号的范围为 1 至 4294967295。支持 4 字节 AS 号的设备能够与持 2 字节 AS 号的设备兼容。

### BGP 分类

如图所示， BGP 按照运行方式分为 EBGP（External/Exterior BGP）和 IBGP（Internal/Interior BGP）。

![](https://pic2.zhimg.com/v2-55a0b8a9bdff23f36c0a1c55727dbba1_r.jpg)

**EBGP：** 运行于不同 AS 之间的 BGP 称为 EBGP。为了防止 AS 间产生环路，当 BGP 设备接收 EBGP 对等体发送的路由时，会将带有本地 AS 号的路由丢弃。

**IBGP：** 运行于同一 AS 内部的 BGP 称为 IBGP。为了防止 AS 内产生环路， BGP 设备不将从 IBGP 对等体学到的路由通告给其他 IBGP 对等体，并与所有 IBGP 对等体建立全连接。为了解决 IBGP 对等体的连接数量太多的问题， BGP 设计了路由反射器和 BGP 联盟。

说明：

如果在 AS 内一台 BGP 设备收到 EBGP 邻居发送的路由后，需要通过另一台 BGP 设备将该路由传输给其他 AS，则推荐使用 IBGP。

**BGP 报文交互中的角色**

BGP 报文交互中分为 Speaker 和 Peer 两种角色。

**Speaker：**发送 BGP 报文的设备称为 BGP 发言者（Speaker），它接收或产生新的报文信息，并发布（Advertise）给其它 BGP Speaker。

**Peer：**相互交换报文的 Speaker 之间互称对等体（Peer）。若干相关的对等体可以构成对等体组（Peer Group）。

**BGP 的路由器号（Router ID）**

BGP 的 Router ID 是一个用于标识 BGP 设备的 32 位的值，通常是 IPv4 地址的形式，在 BGP 会话建立时发送的 Open 报文中携带。对等体之间建立 BGP 会话时，每个 BGP 设备都必须有唯一的 Router ID，否则对等体之间不能建立 BGP 连接。

BGP 的 Router ID 在 BGP 网络中必须是唯一的，可以采用手动配置，也可以让 BGP 自己在设备上选取。缺省情况下， BGP 选择设备上的 Loopback 接口的 IPv4 地址作为 BGP 的 Router ID。如果设备上没有配置 Loopback 接口，系统会选择接口中最大的 IPv4 地址作为 BGP 的 Router ID。一旦选出 Router ID，除非发生接口地址删除等事件，否则即使配置了更大的地址，也保持原来的 Router ID。

**二、BGP 工作原理**

BGP 对等体的建立、更新和删除等交互过程主要有 5 种报文、 6 种状态机和 5 个原则。

**BGP 的报文**

BGP 对等体间通过以下 5 种报文进行交互，其中 Keepalive 报文为周期性发送，其余报文为触发式发送：

Open 报文：用于建立 BGP 对等体连接。

Update 报文：用于在对等体之间交换路由信息。

Notification 报文：用于中断 BGP 连接。

Keepalive 报文：用于保持 BGP 连接。

Route-refresh 报文：用于在改变路由策略后请求对等体重新发送路由信息。只有支持路由刷新（Route-refresh）能力的 BGP 设备会发送和响应此报文。

**BGP 状态机**

如图所示， BGP 对等体的交互过程中存在 6 种状态机：空闲状态（Idle）、连接状态（Connect）、活跃（Active）、 Open 报文已发送（OpenSent）、 Open 报文已确认（OpenConfirm）和连接已建立（Established）。在 BGP 对等体建立的过程中，通常可见的 3 个状态是：Idle、 Active 和 Established。  

![](https://pic2.zhimg.com/v2-c4ee273cc1c32325c14b0f6a87da93d1_b.jpg)

1、Idle 状态是 BGP 初始状态。在 Idle 状态下， BGP 拒绝邻居发送的连接请求。只有在收到本设备的 Start 事件后， BGP 才开始尝试和其它 BGP 对等体进行 TCP 连接，并转至 Connect 状态。

**说明：**  

Start 事件是由一个操作者配置一个 BGP 过程，或者重置一个已经存在的过程或者路由器软件重置 BGP 过程引起的。

任何状态中收到 Notification 报文 或 TCP 拆链通知等 Error 事件后， BGP 都会转至 Idle 状态。

2、在 Connect 状态下， BGP 启动连接重传定时器（Connect Retry），等待 TCP 完成连接。

如果 TCP 连接成功，那么 BGP 向对等体发送 Open 报文，并转至 OpenSent 状态；

如果 TCP 连接失败，那么 BGP 转至 Active 状态；

如果连接重传定时器超时， BGP 仍没有收到 BGP 对等体的响应，那么 BGP 继续尝试和其它 BGP 对等体进行 TCP 连接，停留在 Connect 状态。

3、在 Active 状态下， BGP 总是在试图建立 TCP 连接。

如果 TCP 连接成功，那么 BGP 向对等体发送 Open 报文，关闭连接重传定时器，并转至 OpenSent 状态；

如果 TCP 连接失败，那么 BGP 停留在 Active 状态；

如果连接重传定时器超时， BGP 仍没有收到 BGP 对等体的响应，那么 BGP 转至 Connect 状态。

4、在 OpenSent 状态下， BGP 等待对等体的 Open 报文，并对收到的 Open 报文中的 AS 号、版本号、 认证码等进行检查。

如果收到的 Open 报文正确，那么 BGP 发送 Keepalive 报文，并转至 OpenConfirm 状态；

如果发现收到的 Open 报文有错误，那么 BGP 发送 Notification 报文给对等体，并转至 Idle 状态。

5、在 OpenConfirm 状态下， BGP 等待 Keepalive 或 Notification 报文。如果收到 Keepalive 报文，则转至 Established 状态，如果收到 Notification 报文，则转至 Idle 状态。

6、在 Established 状态下， BGP 可以和对等体交换 Update、 Keepalive、 Route-refresh 报文和 Notification 报文。

如果收到正确的 Update 或 Keepalive 报文，那么 BGP 就认为对端处于正常运行状态，将保持 BGP 连接。

如果收到错误的 Update 或 Keepalive 报文，那么 BGP 发送 Notification 报文通知对端，并转至 Idle 状态。

Route-refresh 报文不会改变 BGP 状态。

如果收到 Notification 报文，那么 BGP 转至 Idle 状态。

如果收到 TCP 拆链通知，那么 BGP 断开连接，转至 Idle 状态。

**BGP 对等体之间的交互原则**

BGP 设备将最优路由加入 BGP 路由表，形成 BGP 路由。BGP 设备与对等体建立邻居关系后，采取以下交互原则：

1、从 IBGP 对等体获得的 BGP 路由， BGP 设备只发布给它的 EBGP 对等体。

2、从 EBGP 对等体获得的 BGP 路由， BGP 设备发布给它所有 EBGP 和 IBGP 对等体。

3、当存在多条到达同一目的地址的有效路由时， BGP 设备只将最优路由发布给对等体。

4、路由更新时， BGP 设备只发送更新的 BGP 路由。

5、所有对等体发送的路由， BGP 设备都会接收。

**三、BGP 与 IGP 交互**

BGP 与 IGP 在设备中使用不同的路由表，为了实现不同 AS 间相互通讯， BGP 需要与 IGP 进行交互，即 BGP 路由表和 IGP 路由表相互引入。

**BGP 引入 IGP 路由**

BGP 协议本身不发现路由，因此需要将其他路由引入到 BGP 路由表，实现 AS 间的路由互通。当一个 AS 需要将路由发布给其他 AS 时， AS 边缘路由器会在 BGP 路由表中引入 IGP 的路由。为了更好的规划网络， BGP 在引入 IGP 的路由时，可以使用路由策略进行路由过滤和路由属性设置，也可以设置 MED 值指导 EBGP 对等体判断流量进入 AS 时选路。

**BGP 引入路由时支持 Import 和 Network 两种方式：**

1、 Import 方式是按协议类型，将 RIP 路由、 OSPF 路由、 ISIS 路由等协议的路由引入到 BGP 路由表中。为了保证引入的 IGP 路由的有效性， Import 方式还可以引入静态路由和直连路由。

2、Network 方式是逐条将 IP 路由表中已经存在的路由引入到 BGP 路由表中，比 Import 方式更精确。

**IGP 引入 BGP 路由**

当一个 AS 需要引入其他 AS 的路由时， AS 边缘路由器会在 IGP 路由表中引入 BGP 的路由。为了避免大量 BGP 路由对 AS 内设备造成影响，当 IGP 引入 BGP 路由时，可以使用路由策略，进行路由过滤和路由属性设置。

**应用：**

如图所示，某公司海外市场部所在区域 AS100 部署 OSPF 网络，国内研发部所在区域 AS200 部署 ISIS 网络， AS100 与 AS200 通过部署 BGP 实现互通。公司希望海外市场部可以向研发部发送文件，而国内研发部不能向海外市场部发送文件。

IGP 引入 BGP 示意图

![](https://pic1.zhimg.com/v2-350120da05b4d76ce614ae49c3e5be1c_r.jpg)

为了实现公司的要求，必须让 AS100 中设备知道 AS200 的路由，而 AS200 中设备不知道 AS100 的路由。先在 RouterC 上部署 BGP 引入 ISIS 路由，使 RouterC 的 BGP 路由表中存在 AS200 的路由，并把路由发布给 RouterB。再在 RouterB 上部署 OSPF 引入 BGP 路由，实现 AS100 内设备知道 AS200 的路由，而 AS200 的设备不知道 AS100 的路由。

**四、BGP 安全性**

BGP 使用认证和 GTSM（Generalized TTL Security Mechanism）两个方法保证 BGP 对等体间的交互安全。

**BGP 认证**

BGP 认证分为 MD5 认证和 Keychain 认证，对 BGP 对等体关系进行认证是提高安全性的有效手段。MD5 认证只能为 TCP 连接设置认证密码，而 Keychain 认证除了可以为 TCP 连接设置认证密码外，还可以对 BGP 协议报文进行认证。

**BGP GTSM**

BGP GTSM 检测 IP 报文头中的 TTL（time-to-live）值是否在一个预先设置好的特定范围内，并对不符合 TTL 值范围的报文进行允许通过或丢弃的操作，从而实现了保护 IP 层以上业务，增强系统安全性的目的。

例如将 IBGP 对等体的报文的 TTL 的范围设为 254 至 255。当攻击者模拟合法的 BGP 协议报文，对设备不断的发送报文进行攻击时， TTL 值必然小于 254。如果没有使能 BGP GTSM 功能，设备收到这些报文后，发现是发送给本机的报文，会直接上送控制层面处理。这时将会因为控制层面处理大量攻击报文，导致设备 CPU 占用率高，系统异常繁忙。如果使能 BGP GTSM 功能，系统会对所有 BGP 报文的 TTL 值进行检查。丢弃 TTL 值小于 254 的攻击报文，从而避免了网络攻击报文占用 CPU。

**五、BGP 的路由优选规则和负载分担**

在 BGP 路由表中，到达同一目的地可能存在多条路由。此时 BGP 会选择其中一条路由作为最佳路由，并只把此路由发送给其对等体。BGP 为了选出最佳路由，会根据 BGP 的路由优选规则依次比较这些路由的 BGP 属性。

**BGP 属性**

路由属性是对路由的特定描述，所有的 BGP 路由属性都可以分为以下 4 类

1、公认必须遵循（Well-known mandatory）：所有 BGP 设备都可以识别此类属性，且必须存在于 Update 报文中。如果缺少这类属性，路由信息就会出错。

2、公认任意（Well-known discretionary）：所有 BGP 设备都可以识别此类属性，但不要求必须存在于 Update 报文中，即就算缺少这类属性，路由信息也不会出错。

3、可选过渡（Optional transitive）：BGP 设备可以不识别此类属性，如果 BGP 设备不识别此类属性，但它仍然会接收这类属性，并通告给其他对等体。

4、可选非过渡（Optional non-transitive）：BGP 设备可以不识别此类属性，如果 BGP 设备不识别此类属性，则会被忽略该属性，且不会通告给其他对等体。

![](https://pic3.zhimg.com/v2-1351fcb9e020b32341a8943f4208922e_r.jpg)

下面介绍几种常用的 BGP 路由属性：

**1、Origin 属性**

Origin 属性用来定义路径信息的来源，标记一条路由是怎么成为 BGP 路由的。它有以下 3 种类型：

**IGP：**具有最高的优先级。通过 network 命令注入到 BGP 路由表的路由，其 Origin 属性为 IGP。

**EGP：**优先级次之。通过 EGP 得到的路由信息，其 Origin 属性为 EGP。

**Incomplete：**优先级最低。通过其他方式学习到的路由信息。比如 BGP 通过 import-route 命令引入的路由，其 Origin 属性为 Incomplete。

**2、AS_Path 属性**

AS_Path 属性按矢量顺序记录了某条路由从本地到目的地址所要经过的所有 AS 编号。在接收路由时，设备如果发现 AS_Path 列表中有本 AS 号，则不接收该路由，从而避免了 AS 间的路由环路。

**当 BGP Speaker 传播自身引入的路由时：**

当 BGP Speaker 将这条路由通告到 EBGP 对等体时，便会在 Update 报文中创建一个携带本地 AS 号的 AS_Path 列表。

当 BGP Speaker 将这条路由通告给 IBGP 对等体时，便会在 Update 报文中创建一个空的 AS_Path 列表。

**当 BGP Speaker 传播从其他 BGP Speaker 的 Update 报文中学习到的路由时：**

当 BGP Speaker 将这条路由通告给 EBGP 对等体时，便会把本地 AS 编号添加在 AS_Path 列表的最前面（最左面）。收到此路由的 BGP 设备根据 AS_Path 属性就可以知道去目的地址所要经过的 AS。离本地 AS 最近的相邻 AS 号排在前面，其他 AS 号按顺序依次排列。

当 BGP Speaker 将这条路由通告给 IBGP 对等体时，不会改变这条路由相关的 AS_Path 属性。

**3、Next_Hop 属性**

Next_Hop 属性记录了路由的下一跳信息。BGP 的下一跳属性和 IGP 的有所不同，不一定就是邻居设备的 IP 地址。通常情况下， Next_Hop 属性遵循下面的规则：

BGP Speaker 在向 EBGP 对等体发布某条路由时，会把该路由信息的下一跳属性设置为本地与对端建立 BGP 邻居关系的接口地址。

BGP Speaker 将本地始发路由发布给 IBGP 对等体时，会把该路由信息的下一跳属性设置为本地与对端建立 BGP 邻居关系的接口地址。

BGP Speaker 在向 IBGP 对等体发布从 EBGP 对等体学来的路由时，并不改变该路由信息的下一跳属性。

**4、Local_Pref 属性**

Local_Pref 属性表明路由器的 BGP 优先级，用于判断流量离开 AS 时的最佳路由。当 BGP 的设备通过不同的 IBGP 对等体得到目的地址相同但下一跳不同的多条路由时，将优先选择 Local_Pref 属性值较高的路由。Local_Pref 属性仅在 IBGP 对等体之间有效，不通告给其他 AS。Local_Pref 属性可以手动配置，如果路由没有配置 Local_Pref 属性， BGP 选路时将该路由的 Local_Pref 值按缺省值 100 来处理。

**5、MED 属性**

MED（Multi-Exit-Discriminator）属性用于判断流量进入 AS 时的最佳路由，当一个运行 BGP 的设备通过不同的 EBGP 对等体得到目的地址相同但下一跳不同的多条路由时，在其它条件相同的情况下，将优先选择 MED 值较小者作为最佳路由。

MED 属性仅在相邻两个 AS 之间传递，收到此属性的 AS 一方不会再将其通告给任何其他第三方 AS。MED 属性可以手动配置，如果路由没有配置 MED 属性， BGP 选路时将该路由的 MED 值按缺省值 0 来处理。

**6、团体属性**

团体属性（Community）用于标识具有相同特征的 BGP 路由，使路由策略的应用更加灵活，同时降低了维护管理的难度。

团体属性分为自定义团体属性和公认团体属性。公认团体属性如表所示。

![](https://pic3.zhimg.com/v2-b4e7d039930eb6f021baf75cc834ad9a_r.jpg)

**7、Originator_ID 属性和 Cluster_List 属性**

Originator_ID 属性和 Cluster_List 属性用于解决路由反射器场景中的环路问题，详细描述请参见路由反射器。

**BGP 选择路由的策略**

当到达同一目的地存在多条路由时， BGP 依次对比下列属性来选择路由：

1、优选协议首选值（PrefVal）最高的路由。

协议首选值（PrefVal）是华为设备的特有属性，该属性仅在本地有效。

2、优选本地优先级（Local_Pref）最高的路由。  

如果路由没有本地优先级， BGP 选路时将该路由按缺省的本地优先级 100 来处理。

3. 依次优选手动聚合路由、自动聚合路由、 network 命令引入的路由、 import-route 命令引入的路由、从对等体学习的路由。

4. 优选 AS 路径（AS_Path）最短的路由。

5. 依次优选 Origin 类型为 IGP、 EGP、 Incomplete 的路由。

6. 对于来自同一 AS 的路由，优选 MED（Multi Exit Discriminator）值最低的路由。

7. 依次优选 EBGP 路由、 IBGP 路由、 LocalCross 路由、 RemoteCross 路由。

PE 上某个 VPN 实例的 VPNv4 路由的 ERT 匹配其他 VPN 实例的 IRT 后复制到该 VPN 实例，称为 LocalCross；从远端 PE 学习到的 VPNv4 路由的 ERT 匹配某个 VPN 实例的 IRT 后复制到该 VPN 实例，称为 RemoteCross。

8．优选到 BGP 下一跳 IGP 度量值（metric）最小的路由。

说明：

在 IGP 中，对到达同一目的地址的不同路由， IGP 根据本身的路由算法计算路由的度量值。

9. 优选 Cluster_List 最短的路由。

10. 优选 Router ID 最小的设备发布的路由。

说明：

如果路由携带 Originator_ID 属性，选路过程中将比较 Originator_ID 的大小（不再比较 RouterID），并优选 Originator_ID 最小的路由。

11. 优选从具有最小 IP Address 的对等体学来的路由。

**BGP 负载分担**

当到达同一目的地址存在多条等价路由时，可以通过 BGP 等价负载分担实现均衡流量的目的。形成 BGP 等价负载分担的条件是 “BGP 选择路由的策略” 的 1 至 8 条规则中需要比较的属性完全相同。

**六、路由反射器**

为保证 IBGP 对等体之间的连通性，需要在 IBGP 对等体之间建立全连接关系。假设在一个 AS 内部有 n 台设备，那么建立的 IBGP 连接数就为 n(n-1)/2。当设备数目很多时，设备配置将十分复杂，而且配置后网络资源和 CPU 资源的消耗都很大。在 IBGP 对等体间使用路由反射器可以解决以上问题。  

**路由反射器相关角色**

如图，在一个 AS 内部关于路由反射器有以下几种角色：

路由反射器示意图

![](https://pic3.zhimg.com/v2-3e562a4bfbffb66775dd21394e0633ca_r.jpg)

**路由反射器 RR（Route Reflector）**：允许把从 IBGP 对等体学到的路由反射到其他 IBGP 对等体的 BGP 设备，类似 OSPF 网络中的 DR。

**客户机（Client）**：与 RR 形成反射邻居关系的 IBGP 设备。在 AS 内部客户机只需要与 RR 直连。

**非客户机（Non-Client）：**既不是 RR 也不是客户机的 IBGP 设备。在 AS 内部非客户机与 RR 之间，以及所有的非客户机之间仍然必须建立全连接关系。

**始发者（Originator）：**在 AS 内部始发路由的设备。Originator_ID 属性用于防止集群内产生路由环路。

**集群（Cluster）**：路由反射器及其客户机的集合。Cluster_List 属性用于防止集群间产生路由环路。

**路由反射器原理**

同一集群内的客户机只需要与该集群的 RR 直接交换路由信息，因此客户机只需要与 RR 之间建立 IBGP 连接，不需要与其他客户机建立 IBGP 连接，从而减少了 IBGP 连接数量。如图所示，在 AS65000 内一台设备作为 RR，三台设备作为客户机，形成 Cluster1。此时 AS65000 中 IBGP 的连接数从配置 RR 前的 10 条减少到 4 条，不仅简化了设备的配置，也减轻了网络和 CPU 的负担。

RR 突破了 “从 IBGP 对等体获得的 BGP 路由， BGP 设备只发布给它的 EBGP 对等体。” 的限制，并采用独有的 Cluster_List 属性和 Originator_ID 属性防止路由环路。RR 向 IBGP 邻居发布路由规则如下：

1、从非客户机学到的路由，发布给所有客户机。

2、从客户机学到的路由，发布给所有非客户机和客户机（发起此路由的客户机除外）。

3、从 EBGP 对等体学到的路由，发布给所有的非客户机和客户机。

**Cluster_List 属性**

路由反射器和它的客户机组成一个集群（Cluster），使用 AS 内唯一的 Cluster ID 作为标识。为了防止集群间产生路由环路，路由反射器使用 Cluster_List 属性，记录路由经过的所有集群的 ClusterID。

当一条路由第一次被 RR 反射的时候， RR 会把本地 Cluster ID 添加到 Cluster List 的前面。如果没有 Cluster_List 属性， RR 就创建一个。

当 RR 接收到一条更新路由时， RR 会检查 Cluster List。如果 Cluster List 中已经有本地 ClusterID，丢弃该路由；如果没有本地 Cluster ID，将其加入 Cluster List，然后反射该更新路由。

**Originator_ID 属性**

Originator ID 由 RR 产生，使用的 Router ID 的值标识路由的始发者，用于防止集群内产生路由环路。

当一条路由第一次被 RR 反射的时候， RR 将 Originator_ID 属性加入这条路由，标识这条路由的发起设备。如果一条路由中已经存在了 Originator_ID 属性，则 RR 将不会创建新的 Originator_ID 属性。

当设备接收到这条路由的时候，将比较收到的 Originator ID 和本地的 Router ID，如果两个 ID 相同，则不接收此路由。

**备份路由反射器**

为增加网络的可靠性，防止单点故障对网络造成影响，有时需要在一个集群中配置一个以上的 RR。

由于 RR 打破了从 IBGP 对等体收到的路由不能传递给其他 IBGP 对等体的限制，所以同一集群内的 RR 之间中可能存在环路。这时， 该集群中的所有 RR 必须使用相同的 Cluster ID，以避免 RR 之间的路由环路。

![](https://pic4.zhimg.com/v2-a9f356fead6c075b97c915ce01ceecff_b.jpg)

如图，路由反射器 RR1 和 RR2 在同一个集群内，配置了相同的 Cluster ID。

当客户机 Client1 从 EBGP 对等体接收到一条更新路由，它将通过 IBGP 向 RR1 和 RR2 通告这条路由。

RR1 和 RR2 在接收到该更新路由后，将本地 Cluster ID 添加到 Cluster List 前面，然后向其他的客户机（Client2、 Client3）反射，同时相互反射。

RR1 和 RR2 在接收到该反射路由后，检查 Cluster List，发现自己的 Cluster ID 已经包含在 Cluster List 中。于是 RR1 和 RR2 丢弃该更新路由，从而避免了路由环路。

**多集群路由反射器**

一个 AS 中可以存在多个集群，各个集群的 RR 之间建立 IBGP 对等体。当 RR 所处的网络层不同时，可以将较低网络层次的 RR 配成客户机，形成分级 RR。当 RR 所处的网络层相同时，可以将不同集群的 RR 全连接，形成同级 RR。

**分级路由反射器**

![](https://pic2.zhimg.com/v2-79a95c096ed9863884de46401fe5ad21_b.jpg)

在实际的 RR 部署中，常用的是分级 RR 的场景。如图， ISP 为 AS100 提供 Internet 路由。AS100 内部分为两个集群，其中 Cluster1 内的四台设备是核心路由器，采用备份 RR 的形式保证可靠性。

**同级路由反射器**

![](https://pic4.zhimg.com/v2-bcf4405353b96d4f01ba440b99ea4c4b_r.jpg)

如图，一个骨干网被分成多个集群。各集群的 RR 互为非客户机关系，并建立全连接。此时虽然每个客户机只与所在集群的 RR 建立 IBGP 连接，但所有 RR 和客户机都能收到全部路由信息。  

广告**华为 ICT 认证系列丛书：HCNA 网络技术学习指南**  
作者：华为技术有限公司  
京东  

**七、BGP 联盟**

解决 AS 内部的 IBGP 网络连接激增问题，除了使用路由反射器之外，还可以使用联盟（Confederation）。联盟将一个 AS 划分为若干个子 AS。每个子 AS 内部建立 IBGP 全连接关系，

子 AS 之间建立联盟 EBGP 连接关系，但联盟外部 AS 仍认为联盟是一个 AS。配置联盟后，原 AS 号将作为每个路由器的联盟 ID。这样有两个好处：一是可以保留原有的 IBGP 属性，包括 Local Preference 属性、 MED 属性和 NEXT_HOP 属性等；二是联盟相关的属性在传出联盟时会自动被删除，即管理员无需在联盟的出口处配置过滤子 AS 号等信息的操作。

联盟示意图

![](https://pic2.zhimg.com/v2-09969a71cb22e7cb6d8b074322cfb31d_r.jpg)

如图所示， AS100 使用联盟后被划分为 3 个子 AS：AS65001、 AS65002 和 AS65003，使用 AS100 作为联盟 ID。此时 IBGP 的连接数量从 10 条减少到 4 条，不仅简化了设备的配置，也减轻了网络和 CPU 的负担。而 AS100 外的 BGP 设备因为仅知道 AS100 的存在，并不知道 AS100 内部的联盟关系，所以不会增加 CPU 的负担。

路由反射器和联盟的比较

![](https://pic1.zhimg.com/v2-929403dcc644af746882dc5ee4b0fd84_r.jpg)

**八、路由聚合**

在大规模的网络中， BGP 路由表十分庞大，给设备造成了很大的负担，同时使发生路由振荡的几率也大大增加，影响网络的稳定性。

路由聚合是将多条路由合并的机制，它通过只向对等体发送聚合后的路由而不发送所有的具体路由的方法，减小路由表的规模。并且被聚合的路由如果发生路由振荡，也不再对网络造成影响，从而提高了网络的稳定性。

BGP 在 IPv4 网络中支持自动聚合和手动聚合两种方式，而 IPv6 网络中仅支持手动聚合方式：

**自动聚合：**对 BGP 引入的路由进行聚合。配置自动聚合后， BGP 将按照自然网段聚合路由（例如非自然网段 A 类地址 10.1.1.1/24 和 10.2.1.1/24 将聚合为自然网段 A 类地址 10.0.0.0/8），并且 BGP 向对等体只发送聚合后的路由。

**手动聚合**：对 BGP 本地路由表中存在的路由进行聚合。手动聚合可以控制聚合路由的属性，以及决定是否发布具体路由。

为了避免路由聚合可能引起的路由环路， BGP 设计了 AS_Sst 属性。AS_Sst 属性是一种无序的 AS_Path 属性，标明聚合路由所经过的 AS 号。当聚合路由重新进入 AS_Sst 属性中列出的任何一个 AS 时， BGP 将会检测到自己的 AS 号在聚合路由的 AS_Sst 属性中，于是会丢弃该聚合路由，从而避免了路由环路的形成。

**九、路由衰减**

当 BGP 应用于复杂的网络环境时，路由振荡十分频繁。为了防止频繁的路由振荡带来的不利影响，BGP 使用路由衰减来抑制不稳定的路由。

路由振荡指路由表中添加一条路由后，该路由又被撤销的过程。当发生路由振荡时，设备就会向邻居发布路由更新，收到更新报文的设备需要重新计算路由并修改路由表。所以频繁的路由振荡会消耗大量的带宽资源和 CPU 资源，严重时会影响到网络的正常工作。

![](https://pic2.zhimg.com/v2-ec20911ee81d1a2bb2e2681b9d603ca5_r.jpg)

路由衰减使用惩罚值（Penalty value）来衡量一条路由的稳定性，惩罚值越高说明路由越不稳定。

如图所示，路由每发生一次振荡， BGP 便会给此路由增加 1000 的惩罚值，其余时间惩罚值会慢慢下降。当惩罚值超过抑制阈值（suppress value）时，此路由被抑制，不加入到路由表中，也不再向其他 BGP 对等体发布更新报文。被抑制的路由每经过一段时间，惩罚值便会减少一半，这个时间称为半衰期（half-life）。当惩罚值降到再使用阈值（reuse value）时，此路由变为可用并被加入到路由表中，同时向其他 BGP 对等体发布更新报文。从路由被抑制到路由恢复可用的时间称为抑制时间（suppress time）。

路由衰减只对 EBGP 路由起作用，对 IBGP 路由不起作用。这是因为 IBGP 路由可能含有本 AS 的路由，而 IGP 网络要求 AS 内部路由表尽可能一致。如果路由衰减对 IBGP 路由起作用，那么当不同设备的衰减参数不一致时，将会导致路由表不一致。

**十、BGP 与 BFD 联动**

BGP 协议通过周期性的向对等体发送报文来实现邻居检测机制。但这种机制检测到故障所需时间比较长，超过 1 秒钟。当数据的传输速度达到 Gbit/s 级别时，这种机制的检测时间将导致大量数据丢失，无法满足网络高可靠性的需求。BGP 与 BFD（Bidirectional Forwarding Detection）联动可以利用 BFD 的毫秒级快速检测机制解决上述问题。

BGP 与 BFD 联动组网图

![](https://pic4.zhimg.com/v2-7ad8619b0c216f43dc208d08c151a01f_r.jpg)

如图所示， RouterA 和 RouterB 分别属于 AS100 和 AS200，两台路由器直接相连并建立 EBGP 连接，并配置 BGP 与 BFD 联动。当 RouterA 和 RouterB 之间的链路发生故障时， BFD 利用毫秒级检测机制感知到 BFD 会话状态由 Up 变为 down，并通知 RouterA 和 RouterB。RouterA 和 RouterB 处理邻居 Down 事件，重新进行 BGP 选路。

**十一、BGP Tracking**

BGP Tracking 可以为 BGP 提供快速的链路故障检测， 加速 BGP 网络的收敛速度。当使能了 BGP Tracking 功能的 BGP 对等体之间的链路发生故障时， BGP Tracking 将快速感知到达邻居的路由的不可达，并由路由管理模块通知到 BGP，从而实现快速收敛。

与 BFD 特性相比， BGP Tracking 配置简单，只需在本地配置而不需要全网配置。但是由于 BGP Tracking 是路由层面的感知方式，而 BFD 是链路层面的感知方式，所以 BGP Tracking 收敛速度比 BFD 慢，不适用于对收敛时间要求较高的语音等业务。  

**应用**

如图所示， RouterA、 RouterB 和 RouterC 之间建立了 IGP 连接， RouterA 和 RouterC 之间建立了 IBGP 邻居，在 RouterA 上配置了 BGP Tracking 功能。当 RouterA 和 RouterB 之间的链路发生故障时，首先 IGP 进行快速收敛，然后 BGP Tracking 将感知到达 RouterC 的路由不可达，并通知 RouterA 上的 BGP，最后 RouterA 中断与 RouterC 之间的 BGP 连接。  

BGP Tracking 组网图

![](https://pic3.zhimg.com/v2-452346c50b80d2709d8a6cdc10f00306_r.jpg)

说明：

如果 IBGP 邻居的建立依赖于 IGP 路由，应配置从 BGP Tracking 发现邻居不可达到 BGP 中断连接的时间间隔，使该时间间隔大于 IGP 路由收敛时间。否则，在闪断导致的 IGP 路由震荡恢复之前，可能 BGP 邻居关系就已经中断了，这样将导致不必要的 BGP 收敛。

**十二、BGP Auto FRR**

BGP Auto FRR（BGP Auto Fast ReRoute）是一种链路故障保护措施，应用于有主备链路的网络拓扑结构中，可以使 BGP 的两个邻居切换或者两个下一跳切换达到亚秒级的收敛速度。

BGP Auto FRR 对于从不同对等体学到的相同前缀的路由，利用最优路由作为主链路进行转发，并自动将次优路由作为备份链路。当主链路出现故障的时候，系统快速响应 BGP 路由不可达的通知，并将转发路径切换到备份链路上保证数据转发。在 BGP 收敛后， BGP Auto FRR 再将流量按 BGP 选出的最佳路由指导转发。

**应用**

如图所示， RouterD 将学到的 BGP 路由发往 AS100 中的 RouterB 和 RouterC，然后 RouterB 和 RouterC 通过反射器将路由发到 RouterA 上， RouterA 上收到下一跳为 RouterB 和 RouterC 的份路由，配置策略优选其中一条链路上收到的路由，这里假设在 RouterA 上优选从 RouterB 发来的路由，主链路是 LinkB，备份链路是 LinkC。

BGP Auto FRR 示意图

![](https://pic1.zhimg.com/v2-9b24a43a948aeb8432a370426f8c6094_r.jpg)

在 RouterA 上使能 Auto FRR，当域内 LinkB 经过的节点或者链路出现故障的时候， RouterA 上到 RouterB 的下一跳信息就会失效，触发转发平面迅速将从 RouterA 到 RouterD 流量快速切换到 LinkC 上，优先保证流量不丢失。同时， RouterA 重新进行 BGP 选路，优选从 RouterC 发来的路由并更新 FIB

**十三、BGP GR 和 NSR**

BGP 的平滑重启 GR（Graceful Restart）和不间断路由 NSR（Non-Stop Routing）作为高可靠性的解决方案，其根本目的都是为了保证用户业务在设备故障的时候不受影响或者影响最小。

**BGP GR**

BGP GR 技术保证了在设备重启或者主备倒换过程中转发层面能够继续指导数据的转发，同时控制层面邻居关系的重建以及路由计算等动作不会影响转发层面的功能，从而避免了路由震荡引发的业务中断，提高了整网的可靠性。

GR 相关概念：

GR Restarter：指由管理员触发或故障触发后，以 GR 方式重启的设备。

GR Helper：GR Restarter 的邻居，协助 GR Restarter 进行 GR 的设备。

GR Time：是 GR Helper 检测到 GR Restarter 重启或者主备倒换后，保持转发信息不删除的时间。

BGP GR 的过程是：

1. 利用 BGP 的能力协商机制， GR Restarter 和 GR Helper 了解彼此的 GR 能力，建立有 GR 能力的会话。

2. 当 GR Helper 检查到 GR Restarter 重启或者主备倒换后，不删除和 GR Restarter 相关的路由和转发表项，也不通知其他邻居，而是等待重建 BGP 连接。

3. GR Restarter 在 GR Time 超时前与重启前的所有 GR Helper 新建立好邻居关系。

**BGP NSR**

NSR 是一种控制平面倒换而邻居不感知的可靠性技术，适用于设备具有主用主控板和备用主控板的场景。与 GR 相比， NSR 具有不需要邻居协助，不存在互通性问题的优点。

![](https://pic4.zhimg.com/v2-947158e2bcc5ecbcc8abf2ceb1cae6eb_r.jpg)