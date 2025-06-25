#!/bin/bash
PROMPT_DIR="/workspaces/dev/.github/prompts"
LOG_FILE="/workspaces/dev/orchestration_log.md"
ACTIVE_PROMPT="/workspaces/dev/active_prompt.txt"
STEP_DONE="/workspaces/dev/step_done.flag"
TIMEOUT=180  # 3 minutes

for prompt in $(ls $PROMPT_DIR/*.prompt.md); do
  cp "$prompt" "$ACTIVE_PROMPT"
  rm -f "$STEP_DONE"
  echo "[$(date -u)] STEP: $prompt" >> "$LOG_FILE"
  echo "Waiting for agent to complete $prompt..."
  SECONDS=0
  while [ ! -f "$STEP_DONE" ]; do
    sleep 5
    if [ $SECONDS -ge $TIMEOUT ]; then
      echo "[$(date -u)] ERROR: Timeout waiting for $prompt" >> "$LOG_FILE"
      # Optionally escalate to recovery here
      break
    fi
  done
  echo "[$(date -u)] DONE: $prompt" >> "$LOG_FILE"
done