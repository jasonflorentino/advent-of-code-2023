if [ -z "$1" ];
  then 
    echo "Error: Expected a day number, like 07."
    exit 1;
  else echo "Setting up new day $1..."; 
fi


echo "Making day directory..."
mkdir $1

echo "Creating files..."
cd $1
touch input
echo "// https://adventofcode.com/2023/day/$1" > index.ts
echo "// (cd $1; bun index.ts)" >> index.ts
echo "" >> index.ts
echo "import * as Util from \"../util\";" >> index.ts
echo "" >> index.ts
echo "const lines = Util.loadInput();" >> index.ts

cd ..
echo "Done!"