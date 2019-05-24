rsync -r src/ docs/
rsync build/contracts/* docs/
git add .
git commit -m 'Compiles assets for Gitlab pages'
git push