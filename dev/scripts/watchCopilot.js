import { exec } from 'child_process';

console.log('Starting Copilot watch mode...');

function runCopilot() {
  const proc = exec('node copilotAutonomy.js');

  proc.stdout.on('data', data => process.stdout.write(data));
  proc.stderr.on('data', data => process.stderr.write(data));

  proc.on('close', code => {
    console.log(`Copilot process exited with code ${code}. Restarting in 5 seconds...`);
    setTimeout(runCopilot, 5000);
  });
}

runCopilot();
