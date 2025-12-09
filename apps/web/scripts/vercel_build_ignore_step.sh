# !/bin/bash

# This script is used in Vercel to determine whether to proceed with the build step.
# It checks the branch name of the current commit. If the branch is "main",
# it exits with a non-zero status to trigger the build. For all other branches,
# it exits with zero to skip the build.
if [[ "$VERCEL_GIT_COMMIT_REF" == "main"]]; then
  exit 1  # build
else
  echo "Skipping build on branch: $VERCEL_GIT_COMMIT_REF"
  exit 0
fi