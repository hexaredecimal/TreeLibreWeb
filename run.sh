#!/bin/env sh

export HOME=`dirname $0`
export OPTS="-h 0.0.0.0 -j ./jetty.properties -c ./webswing.config -pfa ./admin/webswing-admin.properties -adminctx /admin"
export JAVA_OPTS=-Xmx2g
export PID_PATH_NAME=$HOME/webswing.pid

#std out logger config
MAX_OUT_LOG_SIZE=1048576000 # 100 MB
MAX_OUT_LOG_ARCHIVE_FILES=5
OUT_LOG_ARCHIVE_DIR=$HOME/logs/outarchive



java $JAVA_OPTS -jar ./server/webswing-jetty-launcher.jar -serveradmin -aw ./admin/webswing-admin-server.war $OPTS
