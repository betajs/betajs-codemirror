#!/bin/sh
grunt
if [ "$?" != "0" ]; then
	echo GRUNT ERROR
	exit 1
fi
./jslint.sh
if [ "$?" != "0" ]; then
	echo JSLINT ERROR
	exit 1
fi
echo No errors. Continue!