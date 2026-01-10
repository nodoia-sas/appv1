#!/bin/bash

# ===========================================
# SCRIPT PARA CAMBIAR AMBIENTES - TRANSITIA
# ===========================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}  TRANSITIA - CAMBIO DE AMBIENTES${NC}"
    echo -e "${BLUE}============================================${NC}"
    echo ""
    echo -e "${GREEN}Uso:${NC}"
    echo "  ./scripts/switch-env.sh [ambiente]"
    echo ""
    echo -e "${GREEN}Ambientes disponibles:${NC}"
    echo "  local      - Backend local (localhost:8010)"
    echo "  dev        - Desarrollo (api-dev.transitia.com)"
    echo "  staging    - Staging (api-staging.transitia.com)"
    echo "  production - Producción (api.transitia.com)"
    echo ""
    echo -e "${GREEN}Ejemplos:${NC}"
    echo "  ./scripts/switch-env.sh local"
    echo "  ./scripts/switch-env.sh dev"
    echo "  ./scripts/switch-env.sh staging"
    echo "  ./scripts/switch-env.sh production"
    echo ""
    echo -e "${YELLOW}Nota:${NC} Después del cambio, reinicia el servidor con 'npm run dev'"
}

# Función para hacer backup del .env.local actual
backup_current() {
    if [ -f ".env.local" ]; then
        timestamp=$(date +"%Y%m%d_%H%M%S")
        cp .env.local ".env.local.backup_${timestamp}"
        echo -e "${YELLOW}✓${NC} Backup creado: .env.local.backup_${timestamp}"
    fi
}

# Función para mostrar el estado actual
show_current_env() {
    if [ -f ".env.local" ]; then
        current_env=$(grep "NEXT_PUBLIC_APP_ENV=" .env.local 2>/dev/null | cut -d'=' -f2 || echo "no definido")
        echo -e "${BLUE}Ambiente actual:${NC} ${current_env}"
    else
        echo -e "${YELLOW}No hay archivo .env.local configurado${NC}"
    fi
}

# Función para cambiar ambiente
switch_environment() {
    local env=$1
    local env_file=".env.${env}"
    
    # Verificar que el archivo de ambiente existe
    if [ ! -f "$env_file" ]; then
        echo -e "${RED}❌ Error: El archivo $env_file no existe${NC}"
        echo -e "${YELLOW}Archivos disponibles:${NC}"
        ls -1 .env.* 2>/dev/null | grep -E "\.(local|dev|staging|production)$" || echo "  Ninguno encontrado"
        exit 1
    fi
    
    # Hacer backup del actual
    backup_current
    
    # Copiar el nuevo ambiente
    cp "$env_file" ".env.local"
    
    echo -e "${GREEN}✓ Ambiente cambiado a: ${env}${NC}"
    
    # Mostrar información del nuevo ambiente
    echo ""
    echo -e "${BLUE}Configuración aplicada:${NC}"
    grep "NEXT_PUBLIC_APP_ENV=" .env.local
    echo ""
    
    # Mostrar endpoint que se usará
    case $env in
        "local")
            echo -e "${GREEN}Endpoint:${NC} http://localhost:8010/transitia/api/v1"
            ;;
        "dev")
            echo -e "${GREEN}Endpoint:${NC} https://api-dev.transitia.com/transitia/api/v1"
            ;;
        "staging")
            echo -e "${GREEN}Endpoint:${NC} https://api-staging.transitia.com/transitia/api/v1"
            ;;
        "production")
            echo -e "${GREEN}Endpoint:${NC} https://api.transitia.com/transitia/api/v1"
            echo -e "${RED}⚠️  CUIDADO: Estás en PRODUCCIÓN${NC}"
            ;;
    esac
    
    echo ""
    echo -e "${YELLOW}📝 Siguiente paso:${NC} Reinicia el servidor con 'npm run dev'"
}

# Función principal
main() {
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}  TRANSITIA - CAMBIO DE AMBIENTES${NC}"
    echo -e "${BLUE}============================================${NC}"
    echo ""
    
    # Mostrar estado actual
    show_current_env
    echo ""
    
    # Verificar argumentos
    if [ $# -eq 0 ]; then
        echo -e "${YELLOW}❓ ¿A qué ambiente quieres cambiar?${NC}"
        echo ""
        show_help
        exit 1
    fi
    
    local environment=$1
    
    # Validar ambiente
    case $environment in
        "local"|"dev"|"staging"|"production")
            switch_environment "$environment"
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            echo -e "${RED}❌ Ambiente no válido: $environment${NC}"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Ejecutar función principal
main "$@"