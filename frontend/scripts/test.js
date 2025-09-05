#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const mode = args[0] || 'watch';

// Define test configurations
const testConfigs = {
  watch: {
    command: 'react-scripts',
    args: ['test', '--watchAll=false', '--verbose'],
    env: { ...process.env, CI: 'false' }
  },
  coverage: {
    command: 'react-scripts',
    args: ['test', '--coverage', '--watchAll=false', '--verbose'],
    env: { ...process.env, CI: 'false' }
  },
  ci: {
    command: 'react-scripts',
    args: ['test', '--coverage', '--watchAll=false', '--passWithNoTests', '--verbose'],
    env: { ...process.env, CI: 'true' }
  },
  debug: {
    command: 'react-scripts',
    args: ['test', '--watchAll=false', '--verbose', '--no-coverage'],
    env: { ...process.env, CI: 'false', NODE_OPTIONS: '--inspect-brk' }
  },
  update: {
    command: 'react-scripts',
    args: ['test', '--watchAll=false', '--updateSnapshot'],
    env: { ...process.env, CI: 'false' }
  }
};

// Get configuration for the specified mode
const config = testConfigs[mode];

if (!config) {
  console.error(`Unknown test mode: ${mode}`);
  console.error('Available modes:', Object.keys(testConfigs).join(', '));
  process.exit(1);
}

console.log(`Running tests in ${mode} mode...`);
console.log(`Command: ${config.command} ${config.args.join(' ')}`);

// Spawn the test process
const testProcess = spawn(config.command, config.args, {
  stdio: 'inherit',
  env: config.env,
  cwd: path.resolve(__dirname, '..')
});

// Handle process events
testProcess.on('close', (code) => {
  if (code === 0) {
    console.log(`Tests completed successfully in ${mode} mode`);
  } else {
    console.error(`Tests failed with exit code ${code}`);
    process.exit(code);
  }
});

testProcess.on('error', (error) => {
  console.error('Failed to start test process:', error);
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nTerminating test process...');
  testProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\nTerminating test process...');
  testProcess.kill('SIGTERM');
});
