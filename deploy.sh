#!/bin/bash
cd dist && rsync -avz --delete --omit-dir-times --no-perms -e "ssh -p 1335" --exclude-from=../.rsync_excludes ./ root@davideperozzi.de:/var/www/html
