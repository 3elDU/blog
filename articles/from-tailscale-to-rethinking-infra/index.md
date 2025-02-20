---
title: "From installing Tailscale and closing out ports to rethinking server infrastructure"
tags:
  - selfhosting
  - vpn
  - autism
---

> **TL;DR**
>
> I messed up the configuration of my servers and got myself locked out of one of two VPS-es, wasn't able to regain access, and in the end decided to reinstall everything.

# What's the story about

It is about home servers (mine are not exactly "at home", but well...), self-hosting and reinstalling.  
There is not gonna be a moral at the end, this is just a story that I wanted to share.
That's what blogs are about in the end, yeah?

# How it all started

I should introduce you to my servers first.

I had set up [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/) two years ago.
I created two servers:

- Arm compute instance - arm64 processor from Ampere with 4 cores and 24GB of RAM running Ubuntu.
- AMD compute instance - AMD EPYC with one core and 1GB of ram running Arch Linux.

On the first one I ran kinds of stuff - minecraft servers, LLMs, [invidious](https://invidious.io/),
[Syncthing](https://syncthing.net/), etc.  
The latter is much smaller in terms of specs, and it ran simpler things like HTTP servers,
[vaultwarden](https://github.com/dani-garcia/vaultwarden) and [forgejo](https://forgejo.org/).

# One day...

VPNs are nice. Tailscale is especially nice. I won't explain how it works here, because the
guys at tailscale [already did it](https://tailscale.com/blog/how-tailscale-works).

I decided to set it up on my servers too. Because I really like self-hosting as much as possible,
I discovered [headscale](https://headscale.net/).  
Tailscale itself establishes a peer-to-peer connection between every node, but it still has a
central server which does authentication and key exchange. That's the part where headscale is used.  
Instead of pointing your tailscale client to official tailscale control server, you pass your own instance.

The setup went fairly smoothly, I didn't have to pass around any WireGuard keys as I would have to,
if I would do a manual WG setup.

I tested things out, everything worked perfectly. I also set up IPv6 for my servers, because IPv6 is cool!

At this point, I thought of a thing: I always have a direct tunnel to my server, then why do I need
to have open ports for ssh? I can just log in through my server's tailscale local IP.  
The security benefits of this are, of course, very dubious, but why not.

# "The hardening"

I have told OpenSSH to listen on tailscale domain by setting `ListenAddress` to `vps`, which was
the tailscale hostname of my ubuntu server.
I restarted `sshd.service`, and things worked as I would expect:
I was only able to log from inside my VPN network.

Things broke when I rebooted the machine. Tailscale's DNS setup wouldn't finish before SSH service
started, and as such, ssh would not be able to bind to `vps` hostname.

Not a big break. Well, I wasn't able to log in to my server, but thankfully Oracle has a
feature where you can connect to a server through a serial port, and log in like you have physical
access to the machine. That's what I did, I fixed the ssh by binding to tailscale's IP instead of the hostname
(using IPs is fine because they are static and don't change unless you change them).

Okay, done with the first server. I also changed a couple other services to listen on tailscale-local
addresses.

Remember I also have a second server?

# Where things broke bad

I did the same set up with the second server. Changed the SSH listen address to tailscale local IP,
changed the port from 10100 to 22. I used 10100 as the SSH port, because I also hosted Forgejo,
and it had its own SSH server which was actually using the 22nd port.

I rebooted the machine, and I couldn't log in back... Apparently, the Forgejo service started
really fast, and it used the port 22 on 0.0.0.0 (on all interfaces). While SSH only tried to bind
to 22 on 100.64.0.2, the port was already taken.

Not a big deal, I thought, as I tried to log in the same was as I did with the Ubuntu machine,
by using a serial console. But, I haven't set the user password... Nor the root password...
I tried rebooting the machine a couple more times in hope that SSH would be able to bind to that
address and port, but to no avail.

# And they broke even worse

I got myself completely locked out of the system.

You see, although this VPS is much smaller on resources, it hosts one important thing: vaultwarden.
All my password are stored here.

It was 1AM. Although vaultwarden still worked, and I could use it, I had a little panic attack,
and in attempt to fix the server I powered it off and detached the boot volume.  
I wanted to attach it to my main VPS, which I had access to, from there edit the SSH configuration
to use the port 10100 instead, and attach the boot volume back to the VPS it belonged to.

But two servers were in different availability domains (ADs). ARM server was in Frankfurt-2, and
AMD one was in Frankfurt-3. Because of that I couldn't attach the boot volume.

This is where I started acting even more irradically, I made a backup of a boot volume and deleted
the boot volume itself. Thus, I restored it in the availability domain of my main VPS, so I could
attach it.

This is when I learned that, to attach a volume to an instance, you need to have it powered on,
**not powered off**. Interesting limitation, but after a couple hours of struggling I finally
was able to attach the volume to my Ubuntu VPS. I fixed the SSH config, detached it, and thought
this was it.

Now, I have to transfer the volume to another availability domain, and for that I again created
a backup of it and restored it in the availability domain of my Arch VPS.  
But I couldn't attach the boot volume again. The "Replace boot volume" button was inactive, and the
instance still had that boot volume attached, which I deleted.

Again, I struggled for a few hours, looking for a way to attach the boot volume, but it seemed
impossible.

When I had locked out myself out of the system, at least it was still running and I was able to
access my passwords and everything, but not the server was pretty much dead.

# Fixing

Thankfully, all my bitwarden clients still had the passwords cached so I was able to access them. But I wasn't able to add any new ones.
After a day or so of being like this I thought of what I do next.
I decided to install NixOS. I attached the Arch vps's boot volume to Ubuntu VPS and backed up all the data.
Then, I followed [this article](https://mtlynch.io/notes/nix-oracle-cloud/), and used netboot to reboot into NixOS install medium, which was itself loaded over the internet with iPXE. Pretty neat, I didn't know you could even access the UEFI setup from the serial console of Oracle cloud. Now I know.

# NixOS setup

There's not really much to note about the NixOS seutp itself. I didn't even use flakes (yet). Step by step, I've restored all my services, but not configured declaratively through Nix.

I was pleasantly surprised that headscale, tailscale, caddy and vaultwarden can all be configured with Nix.

# Aftermath

Never make yourself completely locked out of the system, I guess? As I still had access to the Oracle account itself, I could do whatever I want with the servers.

Besides, I wanted to re-configure my servers anyway. Whether NixOS is good for configuring desktops can be argued, but it is undoubtedly great for configuring servers. You never forget what you have installed, and all the configuration sits in one place.
