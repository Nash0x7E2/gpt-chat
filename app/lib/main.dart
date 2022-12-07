import 'package:flutter/material.dart';
import 'package:gpt_chat/users.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';

// We set our Stream API Key as a `--dart-define` value
const String streamApi = String.fromEnvironment("STREAM_API");

Future<void> main() async {
  // Let's create our client passing it the API and setting the default log level
  final streamClient = StreamChatClient(
    streamApi,
    logLevel: Level.INFO,
  );

  // Set the user for the current running application.
  // To quickly generate a test token for users, check out our JWT generator (https://getstream.io/chat/docs/react/token_generator/)
  await streamClient.connectUser(
    User(id: kDemoUserNash.userId),
    kDemoUserNash.token,
  );

  // Configure the channel we would like to use for messages.
  // Note: You should create the users ahead of time in Stream's dashboard else you will encounter an error.
  final streamChannel = streamClient.channel(
    'messaging',
    id: 'gpt-demo',
    extraData: {
      "name": "Humans and AI",
      "members": ["nash", "jeroen"]
    },
  );

  // Listen for events on our newly created channel. New messages, status changes, etc.
  await streamChannel.watch();

  runApp(
    GTPChat(
      chatClient: streamClient,
      chatChannel: streamChannel,
    ),
  );
}

class GTPChat extends StatefulWidget {
  const GTPChat({
    super.key,
    required this.chatClient,
    required this.chatChannel,
  });

  final StreamChatClient chatClient;
  final Channel chatChannel;

  @override
  State<GTPChat> createState() => _GTPChatState();
}

class _GTPChatState extends State<GTPChat> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GPT and Stream',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const App(),

      // Data is propagated down the widget tree via inherited widgets. Before
      // we can use Stream widgets in our code, we need to set the value of the client.
      builder: (context, child) => StreamChat(
        client: widget.chatClient,
        child: StreamChannel(
          channel: widget.chatChannel,
          child: child!,
        ),
      ),
    );
  }
}

class App extends StatefulWidget {
  const App({Key? key}) : super(key: key);

  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  @override
  Widget build(BuildContext context) {
    return const ChannelPage();
  }
}

class ChannelPage extends StatelessWidget {
  const ChannelPage({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const StreamChannelHeader(),
      body: Column(
        children: const <Widget>[
          Expanded(
            child: StreamMessageListView(),
          ),
          StreamMessageInput(),
        ],
      ),
    );
  }
}