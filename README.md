varnish-can
===========
A nodejs, varnish-cache, status server, that works with varnish-brush

      ___
    //   \\
    |\___/|            _          _         _
    |     |  \  / /\  |_) |\ | | (_  |_| _ /   /\  |\ |
    \_____/   \/ /--\ | \ | \| |  _) | |   \_ /--\ | \|
    _ __ _ __ __ _ __ _ __ __ _ __ _ __ __ _ __ __ _ __

If you use varnish-cache on one or more servers and would like to keep an eye on how varnish is running, then consider installing varnish-can (on the varnish-cache server) and varnish-brush (on a separate server) as a stats archiver and graphing utility.

Varnish-can is a small nodjs app that reports on varnish-cache (stats, logs, top).

Install
-------

 # Install nodejs
 # Adjust the password on varnish-can (and on varnish-brush to match).
 # copy server.js
 # Start it up

Objectives
----------

 * Light weight 
   -- Minimal install on the varnish server, only uses core NodeJS features. No need for npm or any NodeJS modules. Small footprint etc.
 * Authorized access 
   -- No SSL key is required, but some security (limiting who could access the stats) is provided. Namely, the access password is encrypted during transport, and a onetime use URL used for every access. 
 * Did I say light weight?
   -- Well, saying it again won't hurt. Keeping it small, light, simple, so as to keep out of Varnish-Cache's hair.
