export async function configureStream(serverClient) {
    const {commands} = await serverClient.listCommands();
    const commandExists = commands.find((command) => command.name === "gpt");
    if (!commandExists) {
        serverClient.createCommand({
            name: "gpt",
            description: "Have a question? Ask your friendly GPT AI for help!",
            args: "[question]",
        })
            .then(_ => console.log(`Added command for Gpt`))
            .catch((err) => console.error(`Something went wrong adding Hugo custom command ${err}`));
    }
    serverClient.updateAppSettings({
        //FIXME: Replace this URL with your NGrok or server URL.
        custom_action_handler_url: "YOUR-NGORK-URL",
    })
        .then(r => console.log(r))
        .catch(e => console.error(`Unable to add custom action URL ${e}`));
}