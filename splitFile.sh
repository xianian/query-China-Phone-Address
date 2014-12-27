#!/bin/bash

linenum=`wc   -l   query_result.csv|   awk   '{print   $1}'`
n1=1
file=1
while   [   $n1   -lt   $linenum   ]
do
    n2=`expr   $n1   +   499`
    sed   -n   "${n1},   ${n2}p"   query_result.csv >   file_$file.log
    n1=`expr   $n2   +   1`
    file=`expr   $file   +   1`
done

