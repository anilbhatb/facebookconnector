import redis
import pika
import datetime
r= redis.StrictRedis(host='localhost', port=6379, db=0)
flag =1

while (flag):
 #print r.get('foo')
 if (r.dbsize() >0) :
  print datetime.datetime.now().time()   
  print "started pushing" 
  connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
  channel = connection.channel()
  for x in r.keys(pattern='*'):
     splitstr = x.split(":")
     if(len(splitstr) == 1):
        print "deleting unwanted key " + x
        r.delete(x)
        continue
     if( (splitstr[1].find("BrandScore")) != -1 ):
        print splitstr[0] + ":" + r.get(x)
        channel.basic_publish(exchange='amq.topic',routing_key=splitstr[0],body=r.get(x))
     else:
        setvalue = r.spop(x)
        while setvalue:
            #print splitstr[0] + ":"+  setvalue
            channel.basic_publish(exchange='amq.topic',routing_key=splitstr[0],body=setvalue)
            setvalue = r.spop(x)
     r.delete(x) 
  print "ended"
  print datetime.datetime.now().time()
  connection.close()


