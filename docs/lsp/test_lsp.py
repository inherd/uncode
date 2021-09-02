import subprocess
import threading
import json

from tornado import ioloop, process, web, websocket
from pyls_jsonrpc import streams

class LanguageServerWebSocketHandler(websocket.WebSocketHandler):
    writer = None

    def open(self, *args, **kwargs):
        proc = process.Subprocess(
            ['pyls', '-v'], # 具体的LSP实现进程，如 'pyls -v'、'ccls --init={"index": {"onChange": true}}'等
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE
        )
        self.writer = streams.JsonRpcStreamWriter(proc.stdin)

        def consume():
            ioloop.IOLoop()
            reader = streams.JsonRpcStreamReader(proc.stdout)
            reader.listen(lambda msg: self.write_message(json.dumps(msg)))

        thread = threading.Thread(target=consume)
        thread.daemon = True
        thread.start()

    def on_message(self, message):
        self.writer.write(json.loads(message))

    def check_origin(self, origin):
        return True
if __name__ == "__main__":
    app = web.Application([
        ("/", LanguageServerWebSocketHandler),
    ])
    app.listen(9999, address="127.0.0.1")
    ioloop.IOLoop.current().start()