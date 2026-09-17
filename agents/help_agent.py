import os
import importlib
import pkgutil
import agents

COMMAND = "agents"  # Telegram command: /agents

async def handle(update, context):
    agent_list = []
    
    try:
        for _, module_name, _ in pkgutil.iter_modules(agents.__path__):
            if module_name == "help_agent":
                continue
            module = importlib.import_module(f"agents.{module_name}")
            if hasattr(module, "COMMAND"):
                cmd = module.COMMAND
                agent_list.append(f"🤖 **Agent:** `{module_name}` ➔ 📌 `/`{cmd}")

        if agent_list:
            response_text = "📋 **Active AI Agents Registry:**\n\n" + "\n".join(agent_list)
        else:
            response_text = "⚠️ No agents found in the registry."
            
    except Exception as e:
        response_text = f"❌ Error loading agents: {str(e)}"

    await update.message.reply_text(response_text, parse_mode="Markdown")