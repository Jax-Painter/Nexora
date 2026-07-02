module.exports = {
  // Prefix command configuration
  prefix: 'hello',
  aliases: ['hi', 'greet'],
  description: 'Says hello to you!',
  
  // Prefix command execution
  async executePrefix(message, args, client) {
    message.reply(`👋 Hello ${message.author.username}!`);
  },
};
