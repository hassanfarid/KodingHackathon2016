#!/usr/bin/python
import time
import sys
import os

def fetch_events(elastic_con, index_name):
    body_text = {"query": { "bool": { "must": [{"match" : {"isActive": "1"}},{"match" : {"isNew": "1"}}]}}}
    #body_text = {"query" : { "term": {"isActive" : "1"} }}
    results = elastic_con.search(index=index_name, doc_type='log', body=body_text)
    print("Got %d Hits:" % results['hits']['total'])
    obj = []
    if results['hits']['total'] > 0:
        obj = results['hits']['hits']
    return (results['hits']['total'], obj)

def mark_event_as_processed(elastic_con, event, p_id):
    doc = {
        'eventName' : event['_source']['eventName'],
        'hashTag' : event['_source']['hashTag'],
        'dimensions' : event['_source']['dimensions'],
        'ignore' : event['_source']['ignore'],
        'updatedOn' : event['_source']['updatedOn'],
        'isActive' : event['_source']['isActive'],
        'isNew' : "0",
        "p_id": p_id
        }
    #Update Elasticsearch
    res = elastic_con.index(index=index_name, doc_type='log', body=doc, id=event['_id'])
    return res['created'] == False

def create_event_config_file(file_name, file_path, event_id, event_hashtags):
    
    index_name = 'twitter_' + str(event_id).lower()
    file = open(file_path + file_name, 'w')
    file.truncate()
    file.write('input {\n')
    file.write('    twitter {\n')
    file.write('        consumer_key => "JTPo8yb7CcOrJNbd25S2d506D"\n')
    file.write('        consumer_secret => "hnSUZNCFq5kE7pxVk27K0xepLxoLsj7qmpR6D8KNA9QeByx5E4"\n')
    file.write('        oauth_token => "183716100-yHuEpbExkt9rN1UaefqCICj72qiPdlxrEZQaPyEA"\n')
    file.write('        oauth_token_secret => "Iyk6LcKrbuEtLWlnZzRIA9BkHawoSzFngWfd20blRFNuA"\n')
    file.write('        keywords => [')
    file.write(','.join(str('"' + x + '"') for x in event_hashtags))
    file.write(']\n')
    file.write('        full_tweet => true\n')
    file.write('    }\n')
    file.write('}\n')
    
    file.write('output {\n')
    file.write('    elasticsearch {\n')
    file.write('        hosts => "https://43e5a5e45fbb9d7eb1124f5970a5eb5c.us-west-1.aws.found.io:9243/"\n')
    file.write('        index => "' + index_name + '"\n')
    file.write('    }\n')
    file.write('    exec {\n')
    file.write('        command => "python ./../Evenger/tweet_processor.py %{id_str} %{timestamp_ms} ' + index_name + '"\n')
    file.write('    }\n')
    file.write('    stdout { codec => json }\n')
    file.write('}\n')
    
    return True

def child(conf_file):
    time.sleep(5)
    print "New PID= %d"%os.getpid()
    os.system("./../logstash-2.2.2/bin/logstash -f ./twitter_stream_config/" + conf_file + " &")

from elasticsearch import Elasticsearch
es = Elasticsearch(['http://43e5a5e45fbb9d7eb1124f5970a5eb5c.us-west-1.aws.found.io:9200'])
        
#Service loop
while (True):
    #try:
    #Search for isNew and isActive events from event_deteials index
    index_name = "event_details"
    (total_events, list_of_events) = fetch_events(es, index_name)
    print total_events
    #print list_of_events
    
    #Process each event
    for event in list_of_events:
        print "Processing :", event['_id']
        event_id = str(event['_id']).lower()
        file_name = 'twitter_' + event_id + '.conf'
        file_path = './twitter_stream_config/'
        event_hashtags = event['_source']['hashTag']
        if create_event_config_file(file_name, file_path, event_id, event_hashtags):
            print "Event file created."
            
            #start trigger
            newRef=os.fork()
            if newRef==0:
                child(file_name)
                sys.exit(0)
            else:
                print "New process has PID= %d"%newRef
            
            #update Event
            print "Event updated: ", mark_event_as_processed(es, event, newRef)
        else:
            print "Event file creation failed."
    
    print "Time to sleep:", time.ctime()
    time.sleep(10)
    #except:
    #    print "Unexpected error:", sys.exc_info()[0]
    #    sys.exit(1)