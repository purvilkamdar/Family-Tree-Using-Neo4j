import requests
import json

def main():
	d={}
	d['name']="Tushar"
	d['email']="tusharkamdar@hotmail"
	
	dic={}
	dic['name']="Purvil"
	dic['email1']="purvilthemaster@gmail.com"
	dic['email2']="tusharkamdar@hotmail"
	dic['r1']="Father";
	dic['r2']="Son";
	#res=requests.post(url="http://localhost:3000/create",json=d)
	#print (res)
	#print (res.text)
	#res=requests.post(url="http://localhost:3000/deleteNode",json=dic)
	#res=requests.post(url="http://localhost:3000/createRelationship",json=dic)
	res=requests.post(url="http://localhost:3000/getRelationship",json=d)
	print(res)
	print (res.text)
	
if __name__=='__main__':
	main()