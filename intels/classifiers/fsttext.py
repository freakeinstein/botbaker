from __future__ import print_function
import fasttext

class Fsttext:
	'fast text classifier'

	training_file = 'train.txt'
	model_file = 'model'

	def __init__(self, train_file_name, model_file_name):
		self.training_file = train_file_name
		self.model_file = model_file_name

	def train(self):
		print('--- starting training ---')
		fasttext.supervised(self.training_file, self.model_file)
		print('--- fininshed training ---')

	def predict(self, text):
		classifier = fasttext.load_model(self.model_file+'.bin')
		prediction = classifier.predict([text], k=3)
		return prediction