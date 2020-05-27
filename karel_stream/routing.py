from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import game_panel.routing

application = ProtocolTypeRouter({
    # Empty for now (http->django views is added by default)
    # (http->django views is added by default)
    'websocket': AuthMiddlewareStack(
        URLRouter(
            game_panel.routing.websocket_urlpatterns
        )
    ),
})