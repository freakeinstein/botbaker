# botbaker
Open Indic bot builder

> This repo is not official a-mma project. Its maintained by a person or a group at a-mma repository as part of a-mma after effects. 

Bot baker is an open source conversational platform. It currently is in its pre-alpha stage. Botbaker currently supports FAQ / Q&A interactions very elegantly. The backbone of Botbaker is supported by Facebook's Fasttext library. You can train your bot in any language with an interactive web interface. After training, simply serve it as a Messenger chatbot.

![screenshot botbaker](https://user-images.githubusercontent.com/19545678/40854462-2fc73bd4-65ef-11e8-9834-dbb87f7be214.png)

## How to run this application

**you need python 3 to run this application.**

1. Clone this project.
2. Open terminal and go to project location.
```
cd <project location>
```
3. Install python dependencies.
```
pip3 install Cython --install-option="--no-cython-compile"
pip3 install Flask
pip3 install gunicorn
pip3 install requests
pip3 install fasttext
pip3 install fbmessenger
pip3 install python-env
```
4. Run application
```
gunicorn server:app
```
5. Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/) in your browser.

## How to connect to Messenger platform
1. This is your webhook to use in facebook app setup
```
<your public domain/IP>/messenger/webhook
```
2. Create a new file in the <project location> and give it a name `.env`. Add below content to it.
  ```
  FB_VERIFY_TOKEN='<give some randon string here>'
  FB_PAGE_TOKEN='<give your facebook Page Access Token here>'
  ```
2. Restart the server.
