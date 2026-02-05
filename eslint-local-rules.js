'use strict';

/**
 * Custom ESLint rules for Samvaad app
 */

module.exports = {
  /**
   * no-inline-interfaces
   *
   * Enforces that interfaces must be defined in separate .types.ts files,
   * not inline in component files (.tsx) or utility files (.ts that aren't .types.ts)
   *
   * Valid:
   *   - src/components/Button.types.ts → can define interfaces
   *   - src/data/assessmentQuestions.types.ts → can define interfaces
   *
   * Invalid:
   *   - src/components/Button.tsx → cannot define interfaces
   *   - src/utils/storage.ts → cannot define interfaces (should be in storage.types.ts)
   */
  'no-inline-interfaces': {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Enforce interfaces to be defined in separate .types.ts files',
        category: 'Best Practices',
        recommended: true,
      },
      messages: {
        noInlineInterface:
          'Interface "{{name}}" should be defined in a separate .types.ts file. Create {{suggestedFile}} for this interface.',
      },
      schema: [],
    },

    create(context) {
      const filename = context.getFilename();

      // Allow interfaces in .types.ts files
      if (filename.endsWith('.types.ts')) {
        return {};
      }

      // Allow interfaces in /data/ folder (data files need inline types)
      if (filename.includes('/data/')) {
        return {};
      }

      // Allow interfaces in /locales/ folder
      if (filename.includes('/locales/')) {
        return {};
      }

      // Allow interfaces in /context/ folder (context files need inline types)
      if (filename.includes('/context/')) {
        return {};
      }

      return {
        TSInterfaceDeclaration(node) {
          const interfaceName = node.id.name;

          // Suggest the correct .types.ts filename
          const suggestedFile = filename
            .replace(/\.tsx?$/, '.types.ts')
            .split('/')
            .pop();

          context.report({
            node,
            messageId: 'noInlineInterface',
            data: {
              name: interfaceName,
              suggestedFile,
            },
          });
        },
      };
    },
  },
};
