---
title: Comparing IP transit and DIA IPTP Networks
creation date: 2022-11-28 14:33:48
status: todo
tag: 
- Network/IPT
- Network/DIA
---
With everything being digitalized and online, Internet connectivity is fundamental for all modern businesses. As you may know, the Internet is a network of all networks. All these networks need some way to communicate. Some of the ways these networks connect and communicate with each other are via IP transit and DIA.

Unfortunately, nobody, it seems, has tried to make it easy to differentiate between IP transit and DIA. Most articles, when it comes to comparing these 2 services, are either filled with jargon or outdated, or just plain mistaken (Yes, we’ve checked).

So this article is IPTP demystify and debunk all the myths and false assumptions about IP transit and DIA, as well as compare the two services.

## IP transit and DIA: What are they?

When you send or receive data on the Internet, it doesn’t mean the data packet can easily travel from A to Z . For data to travel across the Internet, it needs to pass through, or “transit”, one or more third-party networks.

So [what is IP Transit?](https://www.iptp.net/what-is-ip-transit/) In its simplest form, IP Transit is a service that allows traffic to pass via one or many other networks on its way to the final destination. It enables various networks, which are linked to one another, to exchange traffic. The way it works is the networks that are connected to each other agree to accept and carry the other’s traffic.

The reason why traffic must travel around several networks is that many of these network connections are indirect. This is because most providers do not have a worldwide network footprint. Thus, data will be routed via many interconnections before reaching the end customer.

As for DIA, it stands for Direct Internet Access, and it works on the same principle and uses the same equipment with IP transit. IP transit and DIA, essentially, works in the same way. Whether you use DIA or IP transit, your traffic is still traveling on the very same road, that connects all the very same networks, with no dedicated lanes nor special network hops. Of course, even with such similarities, there’s still a technical difference that sets them apart.

## IP transit and DIA: What is the difference?

### Setting up and ASN

DIA is quite simple to set up and needs no special requirements while setting up IP transit is a more complex matter. To be qualified for IP transit service, your company needs to have an assigned ASN and leased or assigned IPv4/IPv6.

Autonomous systems (AS) are the large networks that make up the Internet. An AS is a big network or many networks with a routing strategy. To identify one another, each AS is assigned an official number, known as the ASN (Autonomous System Number). An ASN is required in order to participate in the global Internet routing world.

Generally, ISPs and large companies with access to many networks have ASNs. Those that don’t have one, shall choose to buy DIA rather than IP transit.

### The good, the bad, and the Internet’s entry ticket

Imagine the Internet is a club that you want to join but don’t have an entry ticket, which in this case is the ASN. Can you try to acquire a ticket on your own? Maybe, but it is a complex process that cost more time and resource. Instead, there is an easier and cheaper way of paying a club member to take you in. This is how DIA works. You (who don’t have an ASN) pay the ISP (which owns an ASN) to connect you to the Internet. With DIA, you will have a simple, cheap way that doesn’t need any special requirements to get access to the Internet. Sounds great, isn’t it?

Here’s the catch.

Using DIA service means you are completely locked to a single ISP. This translates to any outages and congestions from the ISP, you will have to wait and suffer through it all. Throwing in some DDoS (distributed denial of service) attacks and you can expect frequent occasions of downtime.

No tapping out!

One more thing to note is DIA always uses a Default Gateway for outbound traffic routing. This means it will hand all outgoing traffic over to the ISP’s nearest router. A router is a device that uses IP addresses to transmit packets between networks. When a device doesn’t know where the destination is, the “Default Gateway” is used to pass information. Basically, a “Default Gateway” is the exit gate for when you want to deliver all packets from inside your network to destinations outside your network. The default route is only of great help for ISPs and enterprises with small networks. The more complicated the network, the more difficult it is to set up and operate effectively.

### With a great price tag comes great connectivity

Meanwhile, IP transit is the complete opposite story. As stated before, IP transit is quite complicated to set up. You are going to need ASN, IPv4 or IPv6, and BGP to be able to deliver IP transit. It is also not a cheap service because of the costly maintenance and upstream expenses.

Instead of being restricted to a single provider like DIA, IP transit offers flexible routing across multiple ISPs. Your data packet will be sent using alternative paths if your preferred route is unavailable due to outages or traffic congestion. Your ISP’s links with IXs and peering partners are what give rise to these different routes. The ability to peer with another ISP is also a thing that DIA lacks.

IP transit is also more dependable and secure because it can mitigate DDoS attacks easier than DIA. So IP transit is better suited to handle a higher number of users and sensitive data.

The one that handles the interconnection for IP Transit is BGP (Border Gate Protocol). BGP is a “Dynamic Routing” protocol. Instead of needing any static records, BGP uses a “Next Hop” attribute for each prefix in a “Routing Table”. Normally, BGP doesn’t have “Default Gateway” configured and makes routing decisions based on “Next Hop” information.

BGP is only used on very large networks, such as ISPs and large companies with many external connecting points. Small and poor ISPs usually choose to push outgoing traffic to Default Gateway because they don’t have sufficient equipment to load a full BGP table into a router memory. Another option is using partial Internet routing, with some routes via one ISP and default via another.

## IP transit and DIA: Which one is more suitable for you?

DIA is the most widely utilized internet service in the world, mostly for general purposes. For businesses with more bandwidth-intensive operations, IP Transit is a superior option.

IP transit is vital for businesses that depend on continuous and reliable internet access. For example, IP transit is suitable for healthcare, manufacturing, financial trading, eCommerce, banking industry, where a few outages or poor latency events may cost a lot of money. It is also ideal for companies with large data transfers. Think of 4K streaming, video conferences, eCommerce operations, editing audio, and video files, major design or coding projects, backup servers, cloud computing storage, etc.

## Let’s recap!

DIA and IP transit provide the same type of service, but each has its own pros and cons.

The most frequently used internet service is DIA. For routing, DIA always uses a “Default Gateway” which hands all outgoing traffic over to the ISP’s nearest router. The advantage of DIA is simple, no specific prerequisites, and cheap setup. One bad thing is you are locked to a single ISP. Thus, you will have to face some downtimes when your ISP experiences outages, congestion, or DDoS assaults. No ability to peer with other ISPs is also a disadvantage.

IP transit is better suited for companies that rely heavily on rock-solid Internet connectivity. IP Transit generally uses BGP for the “Next Hop” attribute. Using algorithms to analyze the data and selects the best path for the next hop, BGP Routing is more dynamic. IP transit is more secure and reliable because of the connection with other ISPs, flexible routing ability, and easier to deal with DDoS. Another advantage is the optimal cost if the ISP is connected to many IXs and peers. The downside of IP transit is the higher cost as well as the more complicated setup.

## Want guidance on IP Transit and Direct Internet Access?

So how important Internet connectivity is to your company? Is your uptime way more vital compared to the higher cost? Or can your business grow just fine with some downtime in between?

Need more guidance on choosing the right service for your business?

Contact IPTP now for clear information on how IP transit and how DIA might help your business. We’re here to help you make educated decisions about your network connectivity needs.