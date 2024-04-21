import { execa } from 'execa';

execa('pnpm', ['vite', 'dev'], {
	stderr: process.stderr,
	stdout: process.stdout,
});
execa('pnpm', ['check:watch'], {
	stderr: process.stderr,
	stdout: process.stdout,
});
