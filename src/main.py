import argparse
import datetime
import email
from aiosmtpd.controller import Controller
from sanic import Sanic
from sanic.log import logger
from api import blueprint as api


class MessageStore(object):
	def __init__(self):
		self.messages = list()

	def add(self, envelope):
		parsed = email.message_from_bytes(envelope.content)
		message = {
			'timestamp': datetime.datetime.now().isoformat(),
			'from': envelope.mail_from,
			'to': envelope.rcpt_tos,
			'raw': envelope.content.decode('utf8', errors='replace'),
			'headers': dict(parsed.items()),
			'message': parsed.get_payload(),
		}
		self.messages.append(message)
		self.log_envelope(envelope)

	def log_envelope(self, envelope):
		logger.info('Message from: {}'.format(envelope.mail_from))
		logger.info('Message to:   {}'.format(', '.join(envelope.rcpt_tos)))
		logger.info('Message data:')
		for ln in envelope.content.decode('utf8', errors='replace').splitlines():
			logger.info(f'> {ln}'.strip())
		logger.info('End of message')


app = Sanic(__name__)


class SMTPHandler:
	async def handle_DATA(self, server, session, envelope):
		app.db.add(envelope)
		return '250 Message accepted for delivery'


def main():
	parser = argparse.ArgumentParser()
	parser.add_argument('--host', help='Bind address, default is 0.0.0.0', default='0.0.0.0')
	parser.add_argument('--port', help='Bind port, default is 3000', default='3000')
	parser.add_argument('--smtp-port', help='SMTP bind port, default is 1025', default='1025')
	parser.add_argument('--accesslog', help='Enable access log', action='store_true')
	args = parser.parse_args()

	app.db = MessageStore()
	app.static('/assets', './src/static/assets')
	app.static('/', './src/static/index.html', content_type="text/html; charset=utf-8")
	app.blueprint(api, url_prefix='/api')

	controller = Controller(
		SMTPHandler(),
		hostname=args.host,
		port=int(args.smtp_port)
	)
	controller.start()
	logger.info('smtpd started @ {}:{}'.format(args.host, args.smtp_port))

	app.run(
		host=args.host,
		port=int(args.port),
		workers=1,
		debug=False,
		access_log=args.accesslog
	)


if __name__ == '__main__':
	main()
