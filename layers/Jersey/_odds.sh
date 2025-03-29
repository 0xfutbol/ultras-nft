#!/usr/local/bin/bash

# Skin color distributions as a single string with prefix:dist format
SKIN_COLOR_DISTRIBUTIONS="
arg:20 40 30 10 0 0
bra:5 25 40 20 10 0
ita:20 40 30 10 0 0
esp:20 40 30 10 0 0
eng:50 30 15 5 0 0
frc:30 30 20 10 5 5
por:20 40 30 10 0 0
ger:50 30 15 5 0 0
usa:25 30 20 5 10 10
pb:50 30 15 5 0 0
uy:20 40 30 10 0 0
col:10 20 30 20 15 5
mex:5 10 30 30 20 5
tur:10 30 30 20 10 0
nig:0 0 5 10 35 50
per:5 10 30 30 20 5
vnz:10 20 30 20 15 5
cnd:40 30 15 5 5 5
rus:20 40 30 10 0 0
ks:0 30 50 20 0 0
jap:0 30 50 20 0 0
bel:50 30 15 5 0 0
cro:20 40 30 10 0 0
sui:50 30 15 5 0 0
sue:50 30 15 5 0 0
esv:20 40 30 10 0 0
elv:20 40 30 10 0 0
smn:20 40 30 10 0 0
cabj:20 40 30 10 0 0
carp:20 40 30 10 0 0
pen:20 40 30 10 0 0
nac:20 40 30 10 0 0
flm:5 25 40 20 10 0
fls:5 25 40 20 10 0
cth:5 25 40 20 10 0
saopaulo:5 25 40 20 10 0
crz:5 25 40 20 10 0
palm:5 25 40 20 10 0
santos:5 25 40 20 10 0
ami:5 25 40 20 10 0
brc:20 40 30 10 0 0
realmadrid:20 40 30 10 0 0
atm:20 40 30 10 0 0
realsoc:20 40 30 10 0 0
city:50 30 15 5 0 0
unt:50 30 15 5 0 0
liv:50 30 15 5 0 0
ars:50 30 15 5 0 0
chs:50 30 15 5 0 0
milan:20 40 30 10 0 0
juv:20 40 30 10 0 0
intm:20 40 30 10 0 0
bym:50 30 15 5 0 0
brr:50 30 15 5 0 0
fnb:10 30 30 20 10 0
glsy:10 30 30 20 10 0
bfc:20 40 30 10 0 0
port:20 40 30 10 0 0
ajx:50 30 15 5 0 0
psg:30 30 20 10 5 5
blz:50 30 15 5 0 0
inm:25 30 20 5 10 10
ms:20 20 20 20 10 10
mss:20 20 20 20 10 10
0x:20 40 30 10 0 0
"

# Jersey weights as a single string with prefix:weight format
JERSEY_WEIGHTS="
arg:2.77
bra:2.77
ita:2.5
esp:2.48
eng:2.47
frc:2.50
por:2.30
ger:2.30
usa:2.30
pb:2.08
uy:1.88
col:1.68
mex:1.68
tur:1.68
nig:1.68
per:1.68
vnz:1.68
cnd:1.46
rus:1.46
ks:1.26
jap:1.26
bel:1.04
cro:1.04
sui:1.04
sue:1.04
esv:0.62
elv:0.62
smn:0.42
realmadrid:2
brc:2
unt:2
psg:2
juv:2
milan:2
liv:2
bym:1.68
intm:1.68
city:1.68
cabj:1.68
carp:1.68
ars:1.50
chs:1.50
brr:1.50
atm:1.50
inm:1.45
ajx:1.4
bfc:1.4
port:1.4
flm:1.08
palm:1.08
cth:1.08
glsy:1.08
fnb:1.08
ms:1.08
mss:1.08
ami:0.88
santos:0.88
saopaulo:0.72
crz:0.72
fls:0.72
pen:0.72
nac:0.72
realsoc:0.54
blz:0.36
"

# Compute total weight of all jerseys
total_weight=0
while IFS=: read -r prefix weight; do
    if [ -z "$weight" ]; then
        echo "Error: Empty weight for prefix $prefix" >&2
        continue
    fi
    total_weight=$(echo "scale=10; $total_weight + $weight" | bc)
done <<< "$JERSEY_WEIGHTS"

if [ -z "$total_weight" ] || [ "$total_weight" = "0" ]; then
    echo "Error: Total weight is zero or unset" >&2
    exit 1
fi

# Function to get distribution for a prefix
get_dist() {
    local prefix="$1"
    echo "$SKIN_COLOR_DISTRIBUTIONS" | grep "^$prefix:" | cut -d: -f2
}

# Function to get weight for a prefix
get_weight() {
    local prefix="$1"
    echo "$JERSEY_WEIGHTS" | grep "^$prefix:" | cut -d: -f2
}

# Function to calculate weight for a prefix and skin
calculate_weight() {
    local prefix="$1"
    local skin="$2"
    dist=$(get_dist "$prefix")
    if [ -z "$dist" ]; then
        echo "Warning: No distribution for $prefix" >&2
        echo "0"
        return
    fi
    dist_array=($dist)
    jersey_weight=$(get_weight "$prefix")
    if [ -z "$jersey_weight" ]; then
        echo "Warning: No jersey weight for $prefix" >&2
        echo "0"
        return
    fi
    p_skin_given_prefix=$(echo "scale=10; ${dist_array[$skin-1]} / 100" | bc)
    p_prefix=$(echo "scale=10; $jersey_weight / $total_weight" | bc)
    p=$(echo "scale=10; $p_prefix * $p_skin_given_prefix" | bc)
    weight=$(echo "scale=10; $p * 10000" | bc)
    weight=$(printf "%.0f" "$weight")
    echo "$weight"
}

# Rename files based on prefix and skin
while IFS=: read -r prefix _; do
    if [ -z "$prefix" ]; then
        echo "Warning: Empty prefix detected" >&2
        continue
    fi
    for skin in {1..6}; do
        calculated_weight=$(calculate_weight "$prefix" "$skin")
        shopt -s nullglob  # Prevent loop if no files match
        for file in ${prefix}${skin}#[0-9]*.png; do
            if [[ -f "$file" ]]; then
                new_file="${prefix}${skin}#${calculated_weight}.png"
                if [[ "$file" != "$new_file" ]]; then
                    echo "Renaming: $file -> $new_file"
                    mv -v "$file" "$new_file"
                fi
            fi
        done
        shopt -u nullglob
    done
done <<< "$JERSEY_WEIGHTS"

echo "File renaming completed."