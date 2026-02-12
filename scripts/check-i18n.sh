#!/usr/bin/env bash
# Check for missing translation keys between en and hi locale files

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOCALES="$ROOT/src/locales"

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

ERRORS=0

flatten_keys() {
  node -e "
    const obj = require('$1');
    function flatten(o, prefix) {
      for (const [k, v] of Object.entries(o)) {
        const key = prefix ? prefix + '.' + k : k;
        if (typeof v === 'object' && v !== null) flatten(v, key);
        else console.log(key);
      }
    }
    flatten(obj, '');
  "
}

for file in common.json translation.json; do
  EN_KEYS=$(flatten_keys "$LOCALES/en/$file" | sort)
  HI_KEYS=$(flatten_keys "$LOCALES/hi/$file" | sort)

  MISSING_IN_HI=$(comm -23 <(echo "$EN_KEYS") <(echo "$HI_KEYS"))
  MISSING_IN_EN=$(comm -13 <(echo "$EN_KEYS") <(echo "$HI_KEYS"))

  if [ -n "$MISSING_IN_HI" ]; then
    echo -e "${RED}[$file] In EN but missing in HI:${NC}"
    echo "$MISSING_IN_HI" | sed 's/^/  - /'
    ERRORS=$((ERRORS + $(echo "$MISSING_IN_HI" | wc -l)))
  fi

  if [ -n "$MISSING_IN_EN" ]; then
    echo -e "${RED}[$file] In HI but missing in EN:${NC}"
    echo "$MISSING_IN_EN" | sed 's/^/  - /'
    ERRORS=$((ERRORS + $(echo "$MISSING_IN_EN" | wc -l)))
  fi

  if [ -z "$MISSING_IN_HI" ] && [ -z "$MISSING_IN_EN" ]; then
    echo -e "${GREEN}[$file] All keys match${NC}"
  fi
done

if [ $ERRORS -gt 0 ]; then
  echo -e "\n${RED}$ERRORS missing key(s) found${NC}"
  exit 1
else
  echo -e "\n${GREEN}All translation keys in sync${NC}"
fi
