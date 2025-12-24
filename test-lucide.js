const { Sparkles } = require('lucide-react');
console.log('Sparkles export type:', typeof Sparkles);
if (!Sparkles) {
    console.error('Sparkles usage will crash React');
    process.exit(1);
} else {
    console.log('Sparkles is valid');
}
