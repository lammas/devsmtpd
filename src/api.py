from sanic.response import json
from sanic import Blueprint

blueprint = Blueprint('api')


@blueprint.route('/messages')
async def get_emails(request):
	messages = list(reversed(request.app.ctx.db.messages))
	return json(dict(messages=messages))
