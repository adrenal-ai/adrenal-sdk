from setuptools import setup, find_packages

setup(
    name="adrenal-sdk",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "requests>=2.25.0",
        "cryptography>=3.4.0",
    ],
    author="Adrenal AI",
    author_email="support@adrenal.ai",
    description="Official Python SDK for Adrenal AI chatbots",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/adrenal-ai/adrenal-sdk",
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.7",
) 