from __future__ import print_function
from fbmessenger import BaseMessenger

class Messenger(BaseMessenger):
	def __init__(self, page_verify_token, page_access_token, message_callback):
		self.page_verify_token = page_verify_token
		self.page_access_token = page_access_token
		self.message_callback = message_callback
		super(Messenger, self).__init__(self.page_access_token)

	def message(self, message):
		self.message_callback(message['message']['text'])

	def delivery(self, message):
		pass

	def read(self, message):
		pass

	def account_linking(self, message):
		pass

	def postback(self, message):
		pass

	def optin(self, message):
		pass