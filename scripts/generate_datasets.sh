"""
Script to copy generated dataset pages from /tmp/dataset_info/ to the local docsite repo.
To run (from the root directory of the repo):
./scripts/generate_datasets.sh
"""

if [ ! -d "/tmp/dataset_info" ];
then
  echo "Please rerun 'blaze run //datacommons/import/mcf/dataset_info:parse_dataset_info' from a CitC client to generate the dataset pages."
else
  # Keep Upcoming Data Inmports page, which is manually updated.
  find "./datasets/" -type f -not -name "*upcoming*" -delete

  for file in "/tmp/dataset_info/"*
    do
      cp $file "./datasets/"
    done
  rm -r "/tmp/dataset_info"
fi

