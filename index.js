const { Client: BotClient, GatewayIntentBits: BotIntents } = require('discord.js');
const { Client: UserClient } = require('discord.js-selfbot-v13');
require('dotenv').config();

// Initialize clients
const userClient = new UserClient({ checkUpdate: false, ws: { properties: { $browser: 'Discord Client' } } });
const botClient = new BotClient({
  intents: [BotIntents.Guilds]
});

// Configuration
const sourceChannels = ['551938432201654272', '617297960035811328'];
const targetChannelId = 'thechannelidyouwantthemessagestogoin';
const targetKeywords = ['yourname', 'yourname', 'yourname'];
const allowBotMessages = true;

// Emoji mapping: Map original emoji IDs to new emoji IDs for each difficulty
const emojiMap = {
  '551933473481424897': '<:Easy:youremojiid>',
  '551933473498333215': '<:Medium:youremojiid>',
  '551933473695465472': '<:Hard:youremojiid>',
  '788672082724388874': '<:Catastrophic:youremojiid>',
  '1216902525928738816': '<:Difficult:youremojiid>',
  '1216902664428720158': '<:Challenging:youremojiid>',
  '739816885696200764': '<:Intense:youremojiid>',
  '739817189959532645': '<:Remorseless:youremojiid>',
  '551933473695203372': '<:Insane:youremojiid>',
  '551933473582088219': '<:Extreme:youremojiid>',
  '551933473657585665': '<:Terrifying:youremojiid>',
};

// Function to replace original emoji IDs with new emojis
function replaceDifficultyWithEmoji(content) {
  console.log(`🔍 Original content: "${content}"`);
  const updatedContent = content.replace(/<:[A-Za-z]+:(\d+)>/g, (match, originalId) => {
    console.log(`🔍 Regex matched: "${match}", Original ID: "${originalId}"`);
    const emoji = emojiMap[originalId] || match; // Fallback to original emoji if no mapping
    console.log(`🔍 Replacing with: "${emoji}"`);
    return emoji;
  });
  console.log(`🔍 Updated content: "${updatedContent}"`);
  return updatedContent;
}

// Debug login
userClient.once('ready', () => {
  console.log(`✅ User client logged in as ${userClient.user.tag}`);
  console.log(`User client guilds: ${userClient.guilds.cache.map(g => `${g.name} (${g.id})`).join(', ') || 'none'}`);
});

botClient.once('ready', () => {
  console.log(`✅ Bot client logged in as ${botClient.user.tag}`);
  console.log(`Bot client guilds: ${botClient.guilds.cache.map(g => `${g.name} (${g.id})`).join(', ') || 'none'}`);
});

// Message handler
userClient.on('messageCreate', async (message) => {
  // Skip if not in source channels
  if (!sourceChannels.includes(message.channel.id)) {
    // console.log(`📩 Message in channel ${message.channel.id} from ${message.author.tag}: "${message.content || 'no content'}"`);
    return;
  }

  // console.log(`📩 Message in channel ${message.channel.id} from ${message.author.tag}: "${message.content || 'no content'}"`);

  // Skip bot messages if not allowed
  if (!allowBotMessages && message.author.bot) {
    // console.log(`⛔ Ignored: Message from bot ${message.author.tag}`);
    return;
  }

  // Check if message content includes any target keywords
  const contentLower = message.content.toLowerCase();
  if (!targetKeywords.some(keyword => contentLower.includes(keyword.toLowerCase()))) {
    // console.log(`⛔ Ignored: Content does not contain target keywords (${targetKeywords.join(', ')})`);
    return;
  }

  console.log(`✅ Match found for content: "${message.content}"`);

  try {
    const targetChannel = await botClient.channels.fetch(targetChannelId);
    console.log(`📬 Fetched target channel: ${targetChannel.name} (${targetChannel.id})`);

    // Forward message content with emoji replacements
    if (message.content) {
      const updatedContent = replaceDifficultyWithEmoji(message.content);
      await targetChannel.send(updatedContent);
      console.log(`📤 Sent updated content: "${updatedContent}"`);
    } else {
      // console.log(`⚠️ No content to forward`);
    }

    // Forward embed(s), if any
    if (message.embeds.length > 0) {
      for (const embed of message.embeds) {
        await targetChannel.send({ embeds: [embed] });
        console.log(`📤 Sent embed from ${message.author.tag}`);
      }
    }
  } catch (error) {
    console.error(`❌ Error forwarding message: ${error.message}`);
  }
});

// Debug token loading
console.log('USER_TOKEN:', process.env.USER_TOKEN ? 'Loaded' : 'Missing');
console.log('BOT_TOKEN:', process.env.BOT_TOKEN ? 'Loaded' : 'Missing');

// Login both clients
userClient.login(process.env.USER_TOKEN).catch(error => console.error(`❌ User client login failed: ${error.message}`));

botClient.login(process.env.BOT_TOKEN).catch(error => console.error(`❌ Bot client login failed: ${error.message}`));


