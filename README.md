      ___
    //   \\
    |\___/|            _          _         _
    |     |  \  / /\  |_) |\ | | (_  |_| _ /   /\  |\ |
    \_____/   \/ /--\ | \ | \| |  _) | |   \_ /--\ | \|

varnish-can
===========

A nodejs, varnish-cache, status server, that works with varnish-brush

If you use varnish-cache on one or more servers and would like to keep an eye on the 
great service that varnish provides, then consider installing varnish-can (on the varnish server) and varnish-brush as a stats archiver and graphing utility.

Varnish-can is a small nodjs app that can report on varnish-cache stats.

Install
-------

 # Install nodejs
 # Adjust the password on varnish-can (and on varnish-brush to match).
 # copy server.js
 # Start it up

Objectives
----------

 * Light weight 
   -- minimal install on the varnish server, only uses core NodeJS features. No need for npm or any NodeJS modules. Small footprint etc.
 * Authorized access 
   -- Without an SSL key, the access password is encrypted during transport. 
 * 
