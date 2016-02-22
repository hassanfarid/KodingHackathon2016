#!/usr/bin/python
import sys
import datetime
import json

def read_commandline(argv):
    if (len(sys.argv) == 4):
        tweet_id = sys.argv[1]
        tweet_timestamp_ms = sys.argv[2]
        index_name = sys.argv[3]
    #return values
    return (tweet_id, tweet_timestamp_ms, index_name)

def fetch_tweet(elastic_con, tweet_id, index_name):
    body_text = {"query" : { "term": {"id_str" : tweet_id} }}
    results = elastic_con.search(index=index_name, doc_type='logs', body=body_text)
    print("Got %d Hits:" % results['hits']['total'])
    obj = {}
    if results['hits']['total'] > 0:
        obj = results['hits']['hits'][0]["_source"]
    return (results['hits']['total'], results['hits']['hits'][0]["_id"], obj)

def extract_fields(tweet_obj):
    tweet_text = tweet_obj['text']
    tweet_timestamp = tweet_obj['@timestamp']
    tweet_lang = tweet_obj['lang']
    tweet_hashtag = []
    for hash in tweet_obj['entities']['hashtags']:
        tweet_hashtag.append(hash['text'])
    tweet_users = []
    for hash in tweet_obj['entities']['user_mentions']:
        tweet_users.append(hash['screen_name'])
    tweet_userid = tweet_obj['user']['id']
    tweet_screenname = tweet_obj['user']['screen_name']
    tweet_name = tweet_obj['user']['name']
    tweet_name_created = tweet_obj['user']['created_at']
    tweet_name_lang = tweet_obj['user']['lang']
    tweet_profile_image_url = tweet_obj['user']['profile_image_url']
    return (tweet_text, tweet_timestamp, tweet_lang, tweet_hashtag, tweet_users, tweet_userid, tweet_screenname, tweet_name, tweet_name_created, tweet_name_lang, tweet_profile_image_url)

def _removeNonAscii(s):
    return "".join(i for i in s if ord(i)<128)

def get_sentiment(keys, text, api):
    apis = {'sentiment': 'http://api.datumbox.com/1.0/TwitterSentimentAnalysis.json',
            'gender': 'http://api.datumbox.com:80/1.0/GenderDetection.json'
        }
    #Call Datum Box API
    import pycurl
    import cStringIO
    text = _removeNonAscii(text)
    
    api_key_index = 0
    while True:
        #Using random API Key
        #from random import randint
        #total_keys = len(keys)
        #api_key_index = randint(0, total_keys-1)
        print "API Index used: ", api_key_index, " Value: " + keys[api_key_index]
        
        buf = cStringIO.StringIO()
        import urllib
        post_param = 'api_key=' + str(api_keys[api_key_index]) +'&text="' + text + '"'
        #print post_param
        c = pycurl.Curl()
        c.setopt(c.URL, apis[api])
        c.setopt(c.POSTFIELDS, post_param)
        c.setopt(pycurl.POST, 1)
        #c.setopt(c.HTTPHEADER, ['Content-Type: application/json', 'Accept: application/json'])
        c.setopt(c.WRITEFUNCTION, buf.write)
        c.perform()
        
        json_obj = json.loads(buf.getvalue())
        print json_obj
        buf.close()
        c.close()
        api_key_index = api_key_index + 1
        if str(json_obj['output']["status"]) == "1":
            break
        elif api_key_index == len(keys):
            return (False, "Unknown")
            break
    tweet_processed = True
    response = str(json_obj['output']["result"]).upper()
    return (tweet_processed, response)

#All variables
unique_id = ''
tweet_id = ''
tweet_text = ''
tweet_timestamp = ''
tweet_timestamp_ms = ''
tweet_processed = False
tweet_sentiment = ''
tweet_gender = ''
tweet_lang = 'en'
tweet_hashtag = ''
tweet_users = ''
tweet_userid = ''
tweet_screenname = ''
tweet_name = ''
tweet_name_created = ''
tweet_name_lang = ''
tweet_profile_image_url = ''
index_name = ''
api_keys = ["d1ec3859d5234dea0f3f05f9a951809d",#hassan.seth
            "63cb2fcaf5c7780e659e20de3b62e881",#arsued04
            "8d7e2dd3e0c3d37920f1dac562e8a1d5",#evengerapi1
            "75519c95780f7026f3dc2b2b85b7ba30",#evengerapi2
            "6a7711ffecff3e9b08812b19128fab27",#evengerapi3
            "8e55801f7e8558a1662a1f6d8877ae10",#evengerapi4
            "d0fffc38d274863b65b4bbb0e119364f",#evengerapi5
            "744fbce70bd44bf2ed907fa554f95b05",#evengerapi6
            "a1cd5c38efd37af973f5439323e06a22"#evengerapi7
    ]

#Read command line for all above
(tweet_id, tweet_timestamp_ms, index_name) = read_commandline(sys.argv)
print index_name + ', ' + tweet_id + ', ' + tweet_timestamp_ms

import time
time.sleep(5)

# Fetch Original tweet from Index (tweet_id, index_name)
from elasticsearch import Elasticsearch
es = Elasticsearch(['http://43e5a5e45fbb9d7eb1124f5970a5eb5c.us-west-1.aws.found.io:9200'])

#Refresh index
es.indices.refresh(index=index_name)

#fetching tweet id in original index
(result_count, unique_id, tweet_object) = fetch_tweet(es, tweet_id, index_name)

#exit if no results found
if result_count == 0:
    sys.exit(1)

print "Found results: ", result_count, " - ", tweet_object['user']['screen_name'], " - ", unique_id

#Extract fields
(tweet_text, tweet_timestamp, tweet_lang, tweet_hashtag, tweet_users, tweet_userid, tweet_screenname, tweet_name, tweet_name_created, tweet_name_lang, tweet_profile_image_url) = extract_fields(tweet_object)

print "Extracted.", (tweet_text, tweet_timestamp, tweet_lang, tweet_hashtag, tweet_users, tweet_userid, tweet_screenname, tweet_name, tweet_name_created, tweet_name_lang, tweet_profile_image_url)


'''
# Variables to prepare
tweet_processed = False
tweet_sentiment = ''
tweet_gender = ''
'''

# Get Sentiment
tweet_processed, tweet_sentiment = get_sentiment(api_keys, tweet_text, 'sentiment')
print "Sentiment: ", tweet_sentiment

# Get Tweet Context Gender
tweet_processed, tweet_gender = get_sentiment(api_keys, tweet_text, 'gender')
print "Gender: ", tweet_gender

doc = {
    'tweet_id' : tweet_id,
    'tweet_text' : tweet_text,
    'tweet_timestamp' : tweet_timestamp,
    'tweet_timestamp_ms' : tweet_timestamp_ms,
    'tweet_processed' : tweet_processed,
    'tweet_sentiment' : tweet_sentiment,
    'tweet_gender' : tweet_gender,
    'tweet_lang' : tweet_lang,
    'tweet_hashtag' : tweet_hashtag,
    'tweet_users' : tweet_users,
    'tweet_userid' : tweet_userid,
    'tweet_screenname' : tweet_screenname,
    'tweet_name' : tweet_name,
    'tweet_name_created' : tweet_name_created,
    'tweet_name_lang' : tweet_name_lang,
    'tweet_profile_image_url' : tweet_profile_image_url
    }
#Update Elasticsearch
res = es.index(index=index_name, doc_type='logs', body=doc, id=unique_id)
print "Created: ", res['created']

#ftching and verifying update
res = es.get(index=index_name, doc_type='logs', id=unique_id)
print("Found it: %s" % str(res['found']))

#print res