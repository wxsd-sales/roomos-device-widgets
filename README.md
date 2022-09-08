RoomOS Device Widgets
=====================
**An app for demoing RoomOS device capabilities in Kiosk/PWA mode.**

This is a proof-of-concept application that generates customized web application links for use on a compatible [RoomOS 11](https://help.webex.com/en-us/article/n01kjh1/New-user-experience-with-RoomOS-11) device in Kiosk/PAW mode.
Kiosk and PWA (Persistent Web App) are new modes that make use of the in-built Web Engine on modern RoomOS devices to display a webpage or custom-made web application on the device. As a result, developers can have full control on the integrations (using APIs and SDKs), branding, controls and UI/UX presented to the end users.

<p align="center">
   <a href="https://app.vidcast.io/share/bb910329-f398-4f04-baec-18ddaf46f493" target="_blank">
       <img src="https://user-images.githubusercontent.com/6129517/189224369-5be0a47e-201e-4d93-8d2b-215ff85879a6.png" alt="roomos-device-widgets"/>
    </a>
</p>

<!-- ⛔️ MD-MAGIC-EXAMPLE:START (TOC:collapse=true&collapseText=Click to expand) -->
<details>
<summary>Table of Contents (click to expand)</summary>
    
  * [Overview](#overview)
  * [Setup](#setup)
  * [Demo](#demo)
  * [Support](#support)

</details>
<!-- ⛔️ MD-MAGIC-EXAMPLE:END -->


## Overview

This application generates customized web application links to demos that you create. In this context, a "demo" is a collection of widgets (brand logo, background, sensors etc.) that make up the UI/controls of a PWA/Kiosk device. You can create multiple demos and activate them on a compatible device of your choice after logging-in. Once activated, the application uses [cloud xAPI requests](https://roomos.cisco.com/docs/Introduction.md#the-xapi) with a Webex Bot token to control the device (make calls, get room analytics data, etc.).


## Setup

These instructions assume that you have:
 - Administrator access to an Org's Webex Control Hub and a compatible RoomOS 11 device (in a shared workspace).
 - [Docker installed](https://docs.docker.com/engine/install/) and running on a Windows (via WSL2), macOS, or Linux machine.
 
 Open a new terminal window and follow the instructions below to setup the project locally for development/demo.

1. Clone this repository and change directory:
   ```
   git clone https://github.com/wssd-sales/roomos-device-widgets && cd roomos-device-widgets
   ```

2. Copy `.env.example` file as `.env`:
   ```
   cp .env.example .env
   ```

3. Review and follow the [Registering your Integration on Webex](https://developer.webex.com/docs/integrations#registering-your-integration) guide.
   - Your registration must have the following [Webex REST API scopes](https://developer.webex.com/docs/integrations#scopes):
      | Scope                     | Description                                                                      |
      |---------------------------|----------------------------------------------------------------------------------|
      | spark-admin:devices_read  | See details for any device in your organization                                  |
      | spark-admin:devices_write | Create, update and delete devices and device configurations in your organization |
      | spark:kms                 | Permission to interact with encrypted content                                    |
   - Use these Redirect URIs: 
     - `https://localhost/auth/webex/callback`
     - `http://localhost/auth/webex/callback`
   - Take note of your Client ID and Client Secret. Assign these values to the `WEBEX_AUTHORIZATION_CODE_CLIENT_ID` 
     and `WEBEX_AUTHORIZATION_CODE_CLIENT_SECRET` environment variables within the `.env` file respectively.

4. Review and follow the [Registering your Integration on Webex](https://developer.webex.com/docs/integrations#registering-your-integration) guide.
   - Your registration must have the following [Webex REST API scopes](https://developer.webex.com/docs/integrations#scopes):
      | Scope                   | Description                                   |
      |-------------------------|-----------------------------------------------|
      | spark:people_read       | Access to read your user's company directory  |
      | spark:kms               | Permission to interact with encrypted content |
   - Use this Redirect URI: `https://oauth-helper-a.wbx2.com/helperservice/v1/actions/device/callback`
   - Take note of your Client ID and Client Secret. Assign these values to the `WEBEX_DEVICE_CODE_CLIENT_ID` 
     and `WEBEX_DEVICE_CODE_CLIENT_SECRET` environment variables within the `.env` file respectively.

5. Review and follow the [Creating a Webex Bot](https://developer.webex.com/docs/bots#creating-a-webex-bot) guide.
   Take note of your Bot ID and Bot access token. Assign these values to the `WEBEX_BOT_ID` and 
   `WEBEX_BOT_TOKEN` environment variables within the `.env` file respectively.

6. Set other environment variables as needed in the `.env` file.

7. Start the application using:
   ```
   docker-compose up
   ```
   
Lastly, navigate to `http://localhost` in your browser and follow instructions.


## Demo

A video where we demo this PoC is available on Vidcast — https://app.vidcast.io/share/bb910329-f398-4f04-baec-18ddaf46f493.


## Support

Please reach out to the WXSD team at [wxsd@external.cisco.com](mailto:wxsd@external.cisco.com?cc=ashessin@cisco.com&subject=Azure%20Group%20Sync) or contact me on Webex (ashessin@cisco.com).

