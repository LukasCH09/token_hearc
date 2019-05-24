rsync -r src/ public/
rsync build/contracts/* public/
git add .
git commit -m 'Compiles assets for Gitlab pages'
git push