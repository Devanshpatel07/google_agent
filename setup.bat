@echo off
echo Running NPM Install
npm install
echo Running NPX Create Next App
npx -y create-next-app@latest frontend --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm
echo Setup Finished
