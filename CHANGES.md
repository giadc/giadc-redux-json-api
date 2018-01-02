# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- setRelationshipOnEntity action for replacing relationships
- clearRelationshipOnEntity action for removing a relationship type completely
- Support for updating an entity by passing a resource object

### Changed
- Drops ImmutableJS for Ramda
- Refactors Redux store to more closely match actual JSONAPI response
- Rewrite in Typescript

### Removed
- Generate Entity function dropped
