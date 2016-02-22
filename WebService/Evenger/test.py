#!/usr/bin/env python
import os

def child():
    import time
    time.sleep(5)
    print "We are in the child process with PID= %d"%os.getpid()
    import subprocess
    subprocess.call("ls")#python tweet_processor_trigger.py")

def parent():
    print "We are in the parent process with PID= %d"%os.getpid()
    newRef=os.fork()
    if newRef==0:
        child()
    else:
        print "We are in the parent process and our child process has PID= %d"%newRef

parent()