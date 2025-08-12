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
const targetChannelId = '1404251586653458454';
const targetKeywords = ['yourname', 'yourname', 'yourname'];
const allowBotMessages = true;

// Emoji mapping: Map original emoji IDs to new emoji IDs for each difficulty
const emojiMap = {
  '551933473481424897': '<:Easy:1404275705977503877>',
  '551933473498333215': '<:Medium:1404275730640011266>',
  '551933473695465472': '<:Hard:1404275751808798730>',
  '788672082724388874': '<:Catastrophic:1404276179778801767>',
  '1216902525928738816': '<:Difficult:1404275772809678928>',
  '1216902664428720158': '<:Challenging:1404275830883876994>',
  '739816885696200764': '<:Intense:1404275851700473947>',
  '739817189959532645': '<:Remorseless:1404275804954955896>',
  '551933473695203372': '<:Insane:1404276097499005011>',
  '551933473582088219': '<:Extreme:1404276115295568023>',
  '551933473657585665': '<:Terrifying:1404276146350194788>',
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
