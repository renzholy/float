rm -rf .next/ out/
rm extension.zip

yarn build
yarn export

cp manifest.json ./out
touch ./out/background.js

mv ./out/_next ./out/next
cd ./out && grep -rli '_next' * | xargs -I@ sed -i '' 's/_next/next/g' @

zip -r -FS ../extension.zip *
