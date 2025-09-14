# CHANGELOG Guide

This guide explains how to maintain the CHANGELOG.md file for future releases.

## 📋 **Format Structure**

The changelog follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format:

```markdown
## [Version] - YYYY-MM-DD

### Added
- New features, countries, or functionality

### Changed
- Modifications to existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security improvements
```

## 🔄 **Release Process with CHANGELOG**

### 1. **Before Release**
```bash
# Update CHANGELOG.md with new version
# Move items from [Unreleased] to new version
# Update version date
```

### 2. **Update Version**
```bash
# Update package.json version
npm version patch  # for 0.3.0 -> 0.3.1
npm version minor  # for 0.3.0 -> 0.4.0
npm version major  # for 0.3.0 -> 1.0.0
```

### 3. **Commit & Tag**
```bash
git add CHANGELOG.md package.json
git commit -m "chore: bump version to X.X.X"
git tag vX.X.X
git push origin main --tags
```

### 4. **Publish**
```bash
npm publish
```

## 📝 **What to Include**

### **Added** (New Features)
- New country support
- New validation methods
- New parsing capabilities
- New utility functions
- New documentation

### **Changed** (Modifications)
- API changes
- Performance improvements
- Documentation updates
- Code refactoring

### **Fixed** (Bug Fixes)
- Validation errors
- Parsing issues
- Edge case handling
- Test fixes

### **Security** (Security)
- Security vulnerabilities
- Input validation improvements
- Dependency updates

## 🌍 **Country Addition Template**

When adding a new country, use this template:

```markdown
### Added
- **Country Name (CODE) Support**: Added [ID Type] validation and parsing
  - Format: `example-format`
  - Length: X digits
  - Checksum: [Algorithm name]
  - Parsing: Extracts [data fields]
```

## 📊 **Version History Table**

Keep the version history table updated:

```markdown
| Version | Date | Countries | Major Features |
|---------|------|-----------|----------------|
| 0.3.0 | 2025-01-14 | 26 | Brazil support, comprehensive docs |
| 0.2.0 | Previous | 25 | Core functionality, 25 countries |
```

## ✅ **Checklist for Each Release**

- [ ] Update CHANGELOG.md with new version
- [ ] Move [Unreleased] items to new version
- [ ] Update version date
- [ ] Update version history table
- [ ] Update country count
- [ ] Update package.json version
- [ ] Create git tag
- [ ] Push to GitHub
- [ ] Publish to npm

## 🚀 **Example: Adding Canada**

```markdown
## [0.4.0] - 2025-01-15

### Added
- **Canada (CA) Support**: Added SIN (Social Insurance Number) validation and parsing
  - Format: `123-456-789`
  - Length: 9 digits
  - Checksum: Luhn Algorithm
  - Parsing: Extracts region, sequence, and check digits
- **Enhanced Documentation**: Updated country tables with Canada

### Changed
- **README.md**: Added Canada to implemented countries list
- **Country Count**: Now supports 27 countries

### Fixed
- Nothing in this release
```

## 📚 **Resources**

- [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
- [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Remember**: Always update the CHANGELOG.md before creating a new release!
