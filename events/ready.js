module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✓ Bot is ready! Logged in as ${client.user.tag}`);
    client.user.setStatus('online');
    client.user.setActivity('ERLC servers', { type: 'WATCHING' });
  },
};