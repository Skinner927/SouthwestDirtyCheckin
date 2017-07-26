#!/bin/bash
# Suggested use:
# * * * * * cd /home/foobar/SouthwestDirtyCheckin && /bin/bash run.sh -c ABC123 -f Joe -l Bob >> last_run.log 2>&1

export NVM_DIR="/home/$(whoami)/.nvm";
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh";

echo $(date "+%b/%d/%y %H:%M:%S")
xvfb-run --server-args="-screen 0 1024x768x24" node index.js "$@"
echo $(date "+%b/%d/%y %H:%M:%S")

echo "DONE"
